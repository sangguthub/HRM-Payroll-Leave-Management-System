package com.example.hrm.dto.employee;

import com.example.hrm.enums.EmployeeStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate dateOfJoining;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private EmployeeStatus status;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
