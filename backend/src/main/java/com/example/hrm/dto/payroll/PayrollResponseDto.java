package com.example.hrm.dto.payroll;

import com.example.hrm.enums.PayrollStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollResponseDto {
    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String designation;
    private Integer payPeriodMonth;
    private Integer payPeriodYear;
    private String payPeriodFormatted; // e.g. "August 2026"
    private Long salaryStructureId;
    private String salaryStructureName;
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal specialAllowance;
    private BigDecimal grossSalary;
    private BigDecimal pf;
    private BigDecimal esi;
    private BigDecimal professionalTax;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    private Integer workingDays;
    private Integer paidDays;
    private Integer leaveDays;
    private PayrollStatus status;
    private LocalDateTime processedAt;
    private Long payslipId;
    private String emailStatus;
}
