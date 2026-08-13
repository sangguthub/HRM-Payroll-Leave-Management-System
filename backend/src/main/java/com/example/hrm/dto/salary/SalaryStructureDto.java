package com.example.hrm.dto.salary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructureDto {
    private Long id;

    @NotBlank(message = "Salary structure name is required")
    private String name;

    private String description;

    @NotNull(message = "Basic salary is required")
    @PositiveOrZero(message = "Basic salary must be zero or positive")
    private BigDecimal basicSalary;

    @NotNull(message = "HRA is required")
    @PositiveOrZero(message = "HRA must be zero or positive")
    private BigDecimal hra;

    @NotNull(message = "Special allowance is required")
    @PositiveOrZero(message = "Special allowance must be zero or positive")
    private BigDecimal specialAllowance;

    private BigDecimal grossSalary;

    @NotNull(message = "PF deduction is required")
    @PositiveOrZero(message = "PF deduction must be zero or positive")
    private BigDecimal pf;

    @NotNull(message = "ESI deduction is required")
    @PositiveOrZero(message = "ESI deduction must be zero or positive")
    private BigDecimal esi;

    @NotNull(message = "Professional Tax is required")
    @PositiveOrZero(message = "Professional Tax must be zero or positive")
    private BigDecimal professionalTax;

    private BigDecimal netSalary;
    private Boolean active;
}
