package com.example.hrm.dto.salary;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryAssignmentRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Salary Structure ID is required")
    private Long salaryStructureId;

    @NotNull(message = "Effective from date is required")
    private LocalDate effectiveFrom;
}
