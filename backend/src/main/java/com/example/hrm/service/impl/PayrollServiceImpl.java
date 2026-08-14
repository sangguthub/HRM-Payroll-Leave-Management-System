package com.example.hrm.service.impl;

import com.example.hrm.dto.payroll.PayrollProcessRequest;
import com.example.hrm.dto.payroll.PayrollResponseDto;
import com.example.hrm.entity.*;
import com.example.hrm.enums.EmployeeStatus;
import com.example.hrm.enums.PayrollStatus;
import com.example.hrm.exception.BadRequestException;
import com.example.hrm.exception.ResourceNotFoundException;
import com.example.hrm.repository.*;
import com.example.hrm.service.EmailService;
import com.example.hrm.service.NotificationService;
import com.example.hrm.service.PayrollService;
import com.example.hrm.service.PayslipPdfService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeSalaryRepository employeeSalaryRepository;
    private final LeaveApplicationRepository leaveApplicationRepository;
    private final UserRepository userRepository;
    private final PayslipPdfService payslipPdfService;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final PayslipRepository payslipRepository;
    private final EmailDeliveryLogRepository emailLogRepository;

    @Override
    @Transactional
    public List<PayrollResponseDto> processMonthlyPayroll(PayrollProcessRequest request, Long processorUserId) {
        int month = request.getMonth();
        int year = request.getYear();

        List<Employee> targetEmployees;
        if (request.getEmployeeId() != null) {
            Employee emp = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + request.getEmployeeId()));
            if (emp.getStatus() != EmployeeStatus.ACTIVE) {
                throw new BadRequestException("Employee is INACTIVE. Payroll cannot be processed.");
            }
            targetEmployees = Collections.singletonList(emp);
        } else {
            targetEmployees = employeeRepository.findByStatus(EmployeeStatus.ACTIVE);
        }

        if (targetEmployees.isEmpty()) {
            throw new BadRequestException("No active employees available for payroll processing.");
        }

        User processor = processorUserId != null ? userRepository.findById(processorUserId).orElse(null) : null;
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();
        int totalMonthDays = yearMonth.lengthOfMonth();

        List<PayrollResponseDto> processedList = new ArrayList<>();

        for (Employee emp : targetEmployees) {
            // 1. Idempotency Check
            if (payrollRepository.existsByEmployeeIdAndPayPeriodMonthAndPayPeriodYear(emp.getId(), month, year)) {
                log.info("Payroll already processed for employee {} for {}/{}", emp.getEmployeeCode(), month, year);
                Payroll existing = payrollRepository.findByEmployeeIdAndPayPeriodMonthAndPayPeriodYear(emp.getId(), month, year).get();
                processedList.add(mapToDto(existing));
                continue;
            }

            // 2. Fetch Effective Salary Structure for the month
            List<EmployeeSalary> effectiveSalaries = employeeSalaryRepository.findEffectiveSalaryAtDate(emp.getId(), monthEnd);
            if (effectiveSalaries.isEmpty()) {
                log.warn("Salary structure not assigned for employee {}. Skipping.", emp.getEmployeeCode());
                continue;
            }

            SalaryStructure structure = effectiveSalaries.get(0).getSalaryStructure();

            // 3. Fetch Approved Leaves in period
            List<LeaveApplication> approvedLeaves = leaveApplicationRepository.findApprovedLeavesInPeriod(emp.getId(), monthStart, monthEnd);
            int leaveDays = approvedLeaves.stream().mapToInt(LeaveApplication::getNumberOfDays).sum();
            int workingDays = totalMonthDays;
            int paidDays = Math.max(0, workingDays - leaveDays);

            // 4. Create Payroll Entity with exact Financial calculations
            Payroll payroll = Payroll.builder()
                    .employee(emp)
                    .payPeriodMonth(month)
                    .payPeriodYear(year)
                    .salaryStructure(structure)
                    .basicSalary(structure.getBasicSalary())
                    .hra(structure.getHra())
                    .specialAllowance(structure.getSpecialAllowance())
                    .grossSalary(structure.getGrossSalary())
                    .pf(structure.getPf())
                    .esi(structure.getEsi())
                    .professionalTax(structure.getProfessionalTax())
                    .totalDeductions(structure.getPf().add(structure.getEsi()).add(structure.getProfessionalTax()))
                    .netSalary(structure.getNetSalary())
                    .workingDays(workingDays)
                    .paidDays(paidDays)
                    .leaveDays(leaveDays)
                    .status(PayrollStatus.PROCESSED)
                    .processedBy(processor)
                    .build();

            Payroll savedPayroll = payrollRepository.save(payroll);

            // 5. Generate PDF Payslip
            Payslip payslip = payslipPdfService.generateAndSavePayslipPdf(savedPayroll);

            // 6. Send Email Automation
            emailService.sendPayslipEmail(payslip);

            // 7. Trigger In-App Notification to Employee
            if (emp.getUser() != null) {
                String monthName = Month.of(request.getMonth()).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                notificationService.createNotification(
                        emp.getUser(),
                        "Payslip Generated",
                        "Your payslip for " + monthName + " " + request.getYear() + " (Net Pay: ₹" + savedPayroll.getNetSalary() + ") is now available for download.",
                        com.example.hrm.enums.NotificationType.PAYSLIP_GENERATED
                );
            }

            processedList.add(mapToDto(savedPayroll));
        }

        return processedList;
    }

    @Override
    public List<PayrollResponseDto> getPayrollByMonthAndYear(Integer month, Integer year) {
        return payrollRepository.findByPayPeriodMonthAndPayPeriodYear(month, year).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PayrollResponseDto> getEmployeePayrollHistory(Long employeeId) {
        return payrollRepository.findByEmployeeIdOrderByPayPeriodYearDescPayPeriodMonthDesc(employeeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PayrollResponseDto getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found with ID: " + id));
        return mapToDto(payroll);
    }

    private PayrollResponseDto mapToDto(Payroll p) {
        String monthName = Month.of(p.getPayPeriodMonth()).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        Optional<Payslip> payslipOpt = payslipRepository.findByPayrollId(p.getId());
        Long payslipId = payslipOpt.map(Payslip::getId).orElse(null);

        String emailStatus = "NOT_SENT";
        if (payslipOpt.isPresent()) {
            List<EmailDeliveryLog> logs = emailLogRepository.findByEmployeeId(p.getEmployee().getId());
            if (!logs.isEmpty()) {
                emailStatus = logs.get(logs.size() - 1).getStatus().name();
            }
        }

        return PayrollResponseDto.builder()
                .id(p.getId())
                .employeeId(p.getEmployee().getId())
                .employeeCode(p.getEmployee().getEmployeeCode())
                .employeeName(p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName())
                .departmentName(p.getEmployee().getDepartment().getName())
                .designation(p.getEmployee().getDesignation())
                .payPeriodMonth(p.getPayPeriodMonth())
                .payPeriodYear(p.getPayPeriodYear())
                .payPeriodFormatted(monthName + " " + p.getPayPeriodYear())
                .salaryStructureId(p.getSalaryStructure().getId())
                .salaryStructureName(p.getSalaryStructure().getName())
                .basicSalary(p.getBasicSalary())
                .hra(p.getHra())
                .specialAllowance(p.getSpecialAllowance())
                .grossSalary(p.getGrossSalary())
                .pf(p.getPf())
                .esi(p.getEsi())
                .professionalTax(p.getProfessionalTax())
                .totalDeductions(p.getTotalDeductions())
                .netSalary(p.getNetSalary())
                .workingDays(p.getWorkingDays())
                .paidDays(p.getPaidDays())
                .leaveDays(p.getLeaveDays())
                .status(p.getStatus())
                .processedAt(p.getProcessedAt())
                .payslipId(payslipId)
                .emailStatus(emailStatus)
                .build();
    }
}
