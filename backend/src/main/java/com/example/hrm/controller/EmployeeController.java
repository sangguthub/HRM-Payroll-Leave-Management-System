package com.example.hrm.controller;

import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.dto.employee.EmployeeRequest;
import com.example.hrm.dto.employee.EmployeeResponse;
import com.example.hrm.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employee Management", description = "APIs for managing employee profiles")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Create Employee", description = "Adds a new employee and initializes leave balances")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse response = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Get All Employees", description = "Fetches a list of all employees")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAllEmployees() {
        return ResponseEntity.ok(ApiResponse.success("Employees fetched successfully", employeeService.getAllEmployees()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Employee by ID", description = "Retrieves detailed profile of an employee")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Employee details fetched", employeeService.getEmployeeById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Update Employee", description = "Updates employee information")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", employeeService.updateEmployee(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Delete / Deactivate Employee", description = "Sets employee status to INACTIVE")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated successfully"));
    }
}
