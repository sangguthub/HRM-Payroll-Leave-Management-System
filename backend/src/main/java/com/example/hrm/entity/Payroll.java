package com.example.hrm.entity;

import com.example.hrm.enums.PayrollStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"employee_id", "pay_period_month", "pay_period_year"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "pay_period_month", nullable = false)
    private Integer payPeriodMonth;

    @Column(name = "pay_period_year", nullable = false)
    private Integer payPeriodYear;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "salary_structure_id", nullable = false)
    private SalaryStructure salaryStructure;

    @Column(name = "basic_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal hra;

    @Column(name = "special_allowance", nullable = false, precision = 12, scale = 2)
    private BigDecimal specialAllowance;

    @Column(name = "gross_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal grossSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal pf;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal esi;

    @Column(name = "professional_tax", nullable = false, precision = 12, scale = 2)
    private BigDecimal professionalTax;

    @Column(name = "total_deductions", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalDeductions;

    @Column(name = "net_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "working_days", nullable = false)
    private Integer workingDays;

    @Column(name = "paid_days", nullable = false)
    private Integer paidDays;

    @Column(name = "leave_days", nullable = false)
    private Integer leaveDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.PROCESSED;

    @Column(name = "processed_at", updatable = false)
    private LocalDateTime processedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;

    @PrePersist
    protected void onCreate() {
        processedAt = LocalDateTime.now();
    }
}
