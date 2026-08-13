package com.example.hrm.service.impl;

import com.example.hrm.entity.*;
import com.example.hrm.exception.PayslipNotFoundException;
import com.example.hrm.repository.EmployeeLeaveBalanceRepository;
import com.example.hrm.repository.PayslipRepository;
import com.example.hrm.service.PayslipPdfService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PayslipPdfServiceImpl implements PayslipPdfService {

    private final PayslipRepository payslipRepository;
    private final EmployeeLeaveBalanceRepository leaveBalanceRepository;

    @Value("${app.payslip.dir:./payslips}")
    private String payslipDir;

    @Override
    public Payslip generateAndSavePayslipPdf(Payroll payroll) {
        Employee emp = payroll.getEmployee();
        String monthName = Month.of(payroll.getPayPeriodMonth()).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        String fileName = "Payslip_" + emp.getEmployeeCode() + "_" + monthName + "_" + payroll.getPayPeriodYear() + ".pdf";

        try {
            Path dirPath = Paths.get(payslipDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            Path filePath = dirPath.resolve(fileName);

            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, Files.newOutputStream(filePath));
            document.open();

            // Styling Colors & Fonts
            Color primaryColor = new Color(26, 86, 219); // Royal Blue
            Color darkGray = new Color(55, 65, 81);
            Color lightGray = new Color(243, 244, 246);
            Color emeraldColor = new Color(16, 185, 129);
            Color roseColor = new Color(225, 29, 72);

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, primaryColor);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, primaryColor);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 9, darkGray);
            Font boldTextFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, darkGray);

            // 1. Header Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{70, 30});

            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.addElement(new Paragraph("ACME CORPORATION", titleFont));
            companyCell.addElement(new Paragraph("123 Business Park, Tech Zone, India | Email: hr@acmecorp.com", subTitleFont));
            headerTable.addCell(companyCell);

            PdfPCell titleCell = new PdfPCell();
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph pTitle = new Paragraph("PAYSLIP", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, primaryColor));
            pTitle.setAlignment(Element.ALIGN_RIGHT);
            Paragraph pPeriod = new Paragraph("Pay Period: " + monthName + " " + payroll.getPayPeriodYear(), boldTextFont);
            pPeriod.setAlignment(Element.ALIGN_RIGHT);
            titleCell.addElement(pTitle);
            titleCell.addElement(pPeriod);
            headerTable.addCell(titleCell);

            document.add(headerTable);
            document.add(new Paragraph(" "));

            // 2. Employee Details Table
            PdfPTable empTable = new PdfPTable(4);
            empTable.setWidthPercentage(100);
            empTable.setWidths(new float[]{25, 25, 25, 25});

            addEmpDetailCell(empTable, "Employee ID:", emp.getEmployeeCode(), boldTextFont, textFont, lightGray);
            addEmpDetailCell(empTable, "Employee Name:", emp.getFirstName() + " " + emp.getLastName(), boldTextFont, textFont, lightGray);
            addEmpDetailCell(empTable, "Department:", emp.getDepartment().getName(), boldTextFont, textFont, lightGray);
            addEmpDetailCell(empTable, "Designation:", emp.getDesignation(), boldTextFont, textFont, lightGray);

            document.add(empTable);
            document.add(new Paragraph(" "));

            // 3. Earnings & Deductions Grid
            PdfPTable salaryTable = new PdfPTable(4);
            salaryTable.setWidthPercentage(100);
            salaryTable.setWidths(new float[]{35, 15, 35, 15});

            // Table Headers
            addHeaderCell(salaryTable, "EARNINGS", emeraldColor, headerFont, 2);
            addHeaderCell(salaryTable, "DEDUCTIONS", roseColor, headerFont, 2);

            // Component Rows
            addSalaryRow(salaryTable, "Basic Salary", "₹" + payroll.getBasicSalary(), "Provident Fund (PF)", "₹" + payroll.getPf(), textFont);
            addSalaryRow(salaryTable, "House Rent Allowance (HRA)", "₹" + payroll.getHra(), "ESI Deduction", "₹" + payroll.getEsi(), textFont);
            addSalaryRow(salaryTable, "Special Allowance", "₹" + payroll.getSpecialAllowance(), "Professional Tax", "₹" + payroll.getProfessionalTax(), textFont);

            // Totals Row
            addSalaryRowBold(salaryTable, "Gross Earnings", "₹" + payroll.getGrossSalary(), "Total Deductions", "₹" + payroll.getTotalDeductions(), boldTextFont, lightGray);

            document.add(salaryTable);
            document.add(new Paragraph(" "));

            // 4. Net Salary Highlight Box
            PdfPTable netTable = new PdfPTable(1);
            netTable.setWidthPercentage(100);
            PdfPCell netCell = new PdfPCell();
            netCell.setBackgroundColor(new Color(239, 246, 255)); // Blue-50
            netCell.setBorderColor(primaryColor);
            netCell.setPadding(10);
            Paragraph netP = new Paragraph("NET SALARY PAYABLE: ₹" + payroll.getNetSalary(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, primaryColor));
            netP.setAlignment(Element.ALIGN_CENTER);
            netCell.addElement(netP);
            netTable.addCell(netCell);

            document.add(netTable);
            document.add(new Paragraph(" "));

            // 5. Leave & Attendance Breakdown Table
            document.add(new Paragraph("Attendance & Leave Summary", sectionFont));
            document.add(new Paragraph(" "));

            PdfPTable leaveTable = new PdfPTable(4);
            leaveTable.setWidthPercentage(100);
            leaveTable.setWidths(new float[]{25, 25, 25, 25});

            addHeaderCell(leaveTable, "Working Days", primaryColor, headerFont, 1);
            addHeaderCell(leaveTable, "Paid Days", primaryColor, headerFont, 1);
            addHeaderCell(leaveTable, "Leave Days", primaryColor, headerFont, 1);
            addHeaderCell(leaveTable, "Leave Balance", primaryColor, headerFont, 1);

            List<EmployeeLeaveBalance> balances = leaveBalanceRepository.findByEmployeeIdAndYear(emp.getId(), payroll.getPayPeriodYear());
            StringBuilder leaveSummary = new StringBuilder();
            for (EmployeeLeaveBalance b : balances) {
                leaveSummary.append(b.getLeaveType()).append(": ").append(b.getRemaining()).append(" rem  ");
            }
            if (leaveSummary.length() == 0) leaveSummary.append("CL:10 SL:12 EL:15");

            addCenterCell(leaveTable, String.valueOf(payroll.getWorkingDays()), textFont);
            addCenterCell(leaveTable, String.valueOf(payroll.getPaidDays()), textFont);
            addCenterCell(leaveTable, String.valueOf(payroll.getLeaveDays()), textFont);
            addCenterCell(leaveTable, leaveSummary.toString(), textFont);

            document.add(leaveTable);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("This is a computer-generated payslip and requires no physical signature.", subTitleFont));

            document.close();

            // Save or Update Payslip Entity
            Payslip payslip = payslipRepository.findByPayrollId(payroll.getId())
                    .orElse(Payslip.builder()
                            .payroll(payroll)
                            .employee(emp)
                            .build());

            payslip.setFileName(fileName);
            payslip.setFilePath(filePath.toString());

            return payslipRepository.save(payslip);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF payslip: " + e.getMessage(), e);
        }
    }

    @Override
    public InputStream getPayslipPdfStream(Long payslipId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new PayslipNotFoundException("Payslip not found with ID: " + payslipId));

        try {
            Path path = Paths.get(payslip.getFilePath());
            if (!Files.exists(path)) {
                // Regenerate if file missing on disk
                generateAndSavePayslipPdf(payslip.getPayroll());
            }
            return Files.newInputStream(path);
        } catch (IOException e) {
            throw new RuntimeException("Error reading payslip PDF file", e);
        }
    }

    private void addEmpDetailCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont, Color bg) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(bg);
        cell.setPadding(6);
        cell.addElement(new Paragraph(label, labelFont));
        cell.addElement(new Paragraph(value, valueFont));
        table.addCell(cell);
    }

    private void addHeaderCell(PdfPTable table, String text, Color bg, Font font, int colspan) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setColspan(colspan);
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void addSalaryRow(PdfPTable table, String eLabel, String eVal, String dLabel, String dVal, Font font) {
        table.addCell(new PdfPCell(new Phrase(eLabel, font)));
        table.addCell(new PdfPCell(new Phrase(eVal, font)));
        table.addCell(new PdfPCell(new Phrase(dLabel, font)));
        table.addCell(new PdfPCell(new Phrase(dVal, font)));
    }

    private void addSalaryRowBold(PdfPTable table, String eLabel, String eVal, String dLabel, String dVal, Font font, Color bg) {
        PdfPCell c1 = new PdfPCell(new Phrase(eLabel, font)); c1.setBackgroundColor(bg); table.addCell(c1);
        PdfPCell c2 = new PdfPCell(new Phrase(eVal, font)); c2.setBackgroundColor(bg); table.addCell(c2);
        PdfPCell c3 = new PdfPCell(new Phrase(dLabel, font)); c3.setBackgroundColor(bg); table.addCell(c3);
        PdfPCell c4 = new PdfPCell(new Phrase(dVal, font)); c4.setBackgroundColor(bg); table.addCell(c4);
    }

    private void addCenterCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(5);
        table.addCell(cell);
    }
}
