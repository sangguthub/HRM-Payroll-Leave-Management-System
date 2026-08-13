package com.example.hrm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_structures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

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

    @Column(name = "net_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateTotals();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotals();
    }

    public void calculateTotals() {
        BigDecimal basic = basicSalary != null ? basicSalary : BigDecimal.ZERO;
        BigDecimal h = hra != null ? hra : BigDecimal.ZERO;
        BigDecimal sa = specialAllowance != null ? specialAllowance : BigDecimal.ZERO;

        grossSalary = basic.add(h).add(sa);

        BigDecimal p = pf != null ? pf : BigDecimal.ZERO;
        BigDecimal e = esi != null ? esi : BigDecimal.ZERO;
        BigDecimal pt = professionalTax != null ? professionalTax : BigDecimal.ZERO;

        BigDecimal totalDeductions = p.add(e).add(pt);
        netSalary = grossSalary.subtract(totalDeductions);
    }
}
