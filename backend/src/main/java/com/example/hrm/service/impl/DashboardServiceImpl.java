package com.example.hrm.service.impl;

import com.example.hrm.dto.dashboard.EmployeeDashboardDto;
import com.example.hrm.dto.dashboard.HrDashboardDto;
import com.example.hrm.dto.employee.EmployeeResponse;
import com.example.hrm.dto.leave.LeaveBalanceDto;
import com.example.hrm.dto.payroll.PayrollResponseDto;
import com.example.hrm.dto.salary.SalaryStructureDto;
import com.example.hrm.entity.Employee;
import com.example.hrm.entity.EmployeeLeaveBalance;
import com.example.hrm.entity.Payroll;
import com.example.hrm.enums.EmailStatus;
import com.example.hrm.enums.EmployeeStatus;
import com.example.hrm.enums.LeaveType;
import com.example.hrm.exception.EmployeeNotFoundException;
import com.example.hrm.repository.EmailDeliveryLogRepository;
import com.example.hrm.repository.EmployeeLeaveBalanceRepository;
import com.example.hrm.repository.EmployeeRepository;
import com.example.hrm.repository.PayrollRepository;
import com.example.hrm.service.DashboardService;
import com.example.hrm.service.EmailService;
import com.example.hrm.service.EmployeeService;
import com.example.hrm.service.LeaveService;
import com.example.hrm.service.PayrollService;
import com.example.hrm.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final PayrollRepository payrollRepository;
    private final EmailDeliveryLogRepository emailLogRepository;
    private final EmployeeLeaveBalanceRepository leaveBalanceRepository;

    private final EmployeeService employeeService;
    private final LeaveService leaveService;
    private final SalaryService salaryService;
    private final PayrollService payrollService;
    private final EmailService emailService;

    @Override
    public HrDashboardDto getHrDashboardData() {
        long totalEmp = employeeRepository.count();
        long activeEmp = employeeRepository.findByStatus(EmployeeStatus.ACTIVE).size();

        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();

        List<Payroll> currentMonthPayrolls = payrollRepository.findByPayPeriodMonthAndPayPeriodYear(currentMonth, currentYear);
        long processed = currentMonthPayrolls.size();
        long pending = Math.max(0, activeEmp - processed);

        long sentEmails = emailLogRepository.findByStatus(EmailStatus.SENT).size();
        long failedEmails = emailLogRepository.findByStatus(EmailStatus.FAILED).size();

        // Calculate total leave usage
        List<EmployeeLeaveBalance> currentBalances = leaveBalanceRepository.findByYear(currentYear);
        int clUsed = currentBalances.stream().filter(b -> b.getLeaveType() == LeaveType.CL).mapToInt(EmployeeLeaveBalance::getUsed).sum();
        int slUsed = currentBalances.stream().filter(b -> b.getLeaveType() == LeaveType.SL).mapToInt(EmployeeLeaveBalance::getUsed).sum();
        int elUsed = currentBalances.stream().filter(b -> b.getLeaveType() == LeaveType.EL).mapToInt(EmployeeLeaveBalance::getUsed).sum();

        // Calculate total gross, deductions, net
        BigDecimal totalGross = currentMonthPayrolls.stream().map(Payroll::getGrossSalary).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDeductions = currentMonthPayrolls.stream().map(Payroll::getTotalDeductions).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalNet = currentMonthPayrolls.stream().map(Payroll::getNetSalary).reduce(BigDecimal.ZERO, BigDecimal::add);

        return HrDashboardDto.builder()
                .totalEmployees(totalEmp)
                .payrollProcessed(processed)
                .pendingPayroll(pending)
                .payslipsSent(sentEmails)
                .failedEmails(failedEmails)
                .totalClUsed(clUsed)
                .totalSlUsed(slUsed)
                .totalElUsed(elUsed)
                .totalGrossSalary(totalGross)
                .totalDeductions(totalDeductions)
                .totalNetSalary(totalNet)
                .recentEmailLogs(emailService.getAllEmailLogs())
                .employeeLeaveBalances(leaveService.getAllBalancesForYear(currentYear))
                .build();
    }

    @Override
    public EmployeeDashboardDto getEmployeeDashboardData(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee record not found for user ID: " + userId));

        EmployeeResponse profile = employeeService.getEmployeeById(employee.getId());
        List<LeaveBalanceDto> leaveBalances = leaveService.getEmployeeBalances(employee.getId(), LocalDate.now().getYear());

        SalaryStructureDto currentSalary = null;
        try {
            currentSalary = salaryService.getActiveSalaryForEmployee(employee.getId());
        } catch (Exception ignored) {}

        List<PayrollResponseDto> recentPayslips = payrollService.getEmployeePayrollHistory(employee.getId());

        return EmployeeDashboardDto.builder()
                .profile(profile)
                .leaveBalances(leaveBalances)
                .currentSalaryStructure(currentSalary)
                .recentPayslips(recentPayslips)
                .build();
    }
}
