package com.example.hrm;

import com.example.hrm.dto.payroll.PayrollProcessRequest;
import com.example.hrm.dto.payroll.PayrollResponseDto;
import com.example.hrm.entity.*;
import com.example.hrm.enums.EmployeeStatus;
import com.example.hrm.enums.PayrollStatus;
import com.example.hrm.repository.*;
import com.example.hrm.service.EmailService;
import com.example.hrm.service.PayslipPdfService;
import com.example.hrm.service.impl.PayrollServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PayrollServiceTest {

    @Mock private PayrollRepository payrollRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private EmployeeSalaryRepository employeeSalaryRepository;
    @Mock private LeaveApplicationRepository leaveApplicationRepository;
    @Mock private UserRepository userRepository;
    @Mock private PayslipPdfService payslipPdfService;
    @Mock private EmailService emailService;
    @Mock private PayslipRepository payslipRepository;
    @Mock private EmailDeliveryLogRepository emailLogRepository;

    @InjectMocks
    private PayrollServiceImpl payrollService;

    private Employee employee;
    private SalaryStructure salaryStructure;
    private EmployeeSalary employeeSalary;

    @BeforeEach
    void setUp() {
        Department dept = Department.builder().id(1L).name("Engineering").build();
        employee = Employee.builder().id(1L).employeeCode("EMP001").firstName("Rahul").lastName("Sharma").department(dept).designation("Developer").status(EmployeeStatus.ACTIVE).build();

        BigDecimal pf = new BigDecimal("2400.00");
        BigDecimal esi = new BigDecimal("0.00");
        BigDecimal profTax = new BigDecimal("200.00");
        BigDecimal totalDeductions = pf.add(esi).add(profTax);

        salaryStructure = SalaryStructure.builder()
                .id(10L)
                .name("Standard")
                .basicSalary(new BigDecimal("20000.00"))
                .hra(new BigDecimal("8000.00"))
                .specialAllowance(new BigDecimal("7000.00"))
                .grossSalary(new BigDecimal("35000.00"))
                .pf(pf)
                .esi(esi)
                .professionalTax(profTax)
                .netSalary(new BigDecimal("32400.00"))
                .build();

        employeeSalary = EmployeeSalary.builder().id(100L).employee(employee).salaryStructure(salaryStructure).effectiveFrom(LocalDate.of(2026, 1, 1)).active(true).build();
    }

    @Test
    @DisplayName("Should process monthly payroll and prevent duplicate execution")
    void testProcessPayrollAndIdempotency() {
        PayrollProcessRequest request = PayrollProcessRequest.builder().month(8).year(2026).employeeId(1L).build();

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(payrollRepository.existsByEmployeeIdAndPayPeriodMonthAndPayPeriodYear(1L, 8, 2026)).thenReturn(false);
        when(employeeSalaryRepository.findEffectiveSalaryAtDate(eq(1L), any())).thenReturn(Collections.singletonList(employeeSalary));
        when(leaveApplicationRepository.findApprovedLeavesInPeriod(eq(1L), any(), any())).thenReturn(Collections.emptyList());

        Payroll savedPayroll = Payroll.builder()
                .id(500L)
                .employee(employee)
                .payPeriodMonth(8)
                .payPeriodYear(2026)
                .salaryStructure(salaryStructure)
                .basicSalary(salaryStructure.getBasicSalary())
                .hra(salaryStructure.getHra())
                .specialAllowance(salaryStructure.getSpecialAllowance())
                .grossSalary(salaryStructure.getGrossSalary())
                .pf(salaryStructure.getPf())
                .esi(salaryStructure.getEsi())
                .professionalTax(salaryStructure.getProfessionalTax())
                .totalDeductions(new BigDecimal("2600.00"))
                .netSalary(salaryStructure.getNetSalary())
                .workingDays(31)
                .paidDays(31)
                .leaveDays(0)
                .status(PayrollStatus.PROCESSED)
                .build();

        when(payrollRepository.save(any())).thenReturn(savedPayroll);
        when(payslipPdfService.generateAndSavePayslipPdf(any())).thenReturn(Payslip.builder().id(1000L).payroll(savedPayroll).employee(employee).build());

        List<PayrollResponseDto> result = payrollService.processMonthlyPayroll(request, 2L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(new BigDecimal("32400.00"), result.get(0).getNetSalary());
        verify(payslipPdfService, times(1)).generateAndSavePayslipPdf(any());
        verify(emailService, times(1)).sendPayslipEmail(any());
    }
}
