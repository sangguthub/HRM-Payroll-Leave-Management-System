package com.example.hrm.service.impl;

import com.example.hrm.entity.Payroll;
import com.example.hrm.entity.Payslip;
import com.example.hrm.exception.ResourceNotFoundException;
import com.example.hrm.repository.PayrollRepository;
import com.example.hrm.repository.PayslipRepository;
import com.example.hrm.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {

    private final PayrollRepository payrollRepository;
    private final PayslipRepository payslipRepository;

    @Override
    public ByteArrayInputStream exportMonthlyPayrollToExcel(Integer month, Integer year) {
        List<Payroll> payrollList = payrollRepository.findByPayPeriodMonthAndPayPeriodYear(month, year);
        if (payrollList.isEmpty()) {
            throw new ResourceNotFoundException("No payroll records found for " + month + "/" + year);
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Payroll_" + month + "_" + year);

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            Row headerRow = sheet.createRow(0);
            String[] columns = {"Employee ID", "Employee Name", "Department", "Designation", "Basic Salary", "HRA", "Special Allowance", "Gross Salary", "PF", "ESI", "Professional Tax", "Total Deductions", "Net Salary", "Working Days", "Paid Days", "Leave Days"};

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Payroll p : payrollList) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getEmployee().getEmployeeCode());
                row.createCell(1).setCellValue(p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName());
                row.createCell(2).setCellValue(p.getEmployee().getDepartment().getName());
                row.createCell(3).setCellValue(p.getEmployee().getDesignation());
                row.createCell(4).setCellValue(p.getBasicSalary().doubleValue());
                row.createCell(5).setCellValue(p.getHra().doubleValue());
                row.createCell(6).setCellValue(p.getSpecialAllowance().doubleValue());
                row.createCell(7).setCellValue(p.getGrossSalary().doubleValue());
                row.createCell(8).setCellValue(p.getPf().doubleValue());
                row.createCell(9).setCellValue(p.getEsi().doubleValue());
                row.createCell(10).setCellValue(p.getProfessionalTax().doubleValue());
                row.createCell(11).setCellValue(p.getTotalDeductions().doubleValue());
                row.createCell(12).setCellValue(p.getNetSalary().doubleValue());
                row.createCell(13).setCellValue(p.getWorkingDays());
                row.createCell(14).setCellValue(p.getPaidDays());
                row.createCell(15).setCellValue(p.getLeaveDays());
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export Excel report: " + e.getMessage(), e);
        }
    }

    @Override
    public ByteArrayInputStream exportMonthlyPayslipsToZip(Integer month, Integer year) {
        List<Payroll> payrollList = payrollRepository.findByPayPeriodMonthAndPayPeriodYear(month, year);
        if (payrollList.isEmpty()) {
            throw new ResourceNotFoundException("No payroll records found for " + month + "/" + year);
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            for (Payroll p : payrollList) {
                Payslip payslip = payslipRepository.findByPayrollId(p.getId()).orElse(null);
                if (payslip != null) {
                    File file = new File(payslip.getFilePath());
                    if (file.exists()) {
                        ZipEntry zipEntry = new ZipEntry(payslip.getFileName());
                        zos.putNextEntry(zipEntry);
                        try (FileInputStream fis = new FileInputStream(file)) {
                            byte[] buffer = new byte[1024];
                            int len;
                            while ((len = fis.read(buffer)) > 0) {
                                zos.write(buffer, 0, len);
                            }
                        }
                        zos.closeEntry();
                    }
                }
            }

            zos.finish();
            return new ByteArrayInputStream(baos.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate ZIP archive: " + e.getMessage(), e);
        }
    }
}
