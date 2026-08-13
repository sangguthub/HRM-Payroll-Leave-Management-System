package com.example.hrm.dto.employee;

import com.example.hrm.enums.EmployeeStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequest {

    @NotBlank(message = "Employee Code is required")
    private String employeeCode;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotNull(message = "Date of joining is required")
    private LocalDate dateOfJoining;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotBlank(message = "Designation is required")
    private String designation;

    private EmployeeStatus status;

    private String password;
}
