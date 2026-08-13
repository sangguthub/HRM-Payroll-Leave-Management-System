package com.example.hrm.controller;

import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.dto.salary.SalaryAssignmentRequest;
import com.example.hrm.dto.salary.SalaryStructureDto;
import com.example.hrm.service.SalaryService;
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
@RequestMapping("/api/salary-structures")
@RequiredArgsConstructor
@Tag(name = "Salary Structure", description = "APIs for configuring salary components and assigning structures")
public class SalaryStructureController {

    private final SalaryService salaryService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Create Salary Structure", description = "Creates a new salary template with Earnings & Deductions")
    public ResponseEntity<ApiResponse<SalaryStructureDto>> createStructure(@Valid @RequestBody SalaryStructureDto dto) {
        SalaryStructureDto response = salaryService.createStructure(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Salary structure created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get All Salary Structures", description = "Fetches all salary structure configurations")
    public ResponseEntity<ApiResponse<List<SalaryStructureDto>>> getAllStructures() {
        return ResponseEntity.ok(ApiResponse.success("Salary structures fetched", salaryService.getAllStructures()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Salary Structure by ID", description = "Retrieves specific salary structure")
    public ResponseEntity<ApiResponse<SalaryStructureDto>> getStructureById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Salary structure details fetched", salaryService.getStructureById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Update Salary Structure", description = "Updates salary components")
    public ResponseEntity<ApiResponse<SalaryStructureDto>> updateStructure(@PathVariable Long id, @Valid @RequestBody SalaryStructureDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Salary structure updated", salaryService.updateStructure(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Deactivate Salary Structure", description = "Sets salary structure active state to false")
    public ResponseEntity<ApiResponse<Void>> deleteStructure(@PathVariable Long id) {
        salaryService.deleteStructure(id);
        return ResponseEntity.ok(ApiResponse.success("Salary structure deactivated"));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Assign Salary Structure to Employee", description = "Assigns salary structure and updates effective dates in history")
    public ResponseEntity<ApiResponse<Void>> assignSalary(@Valid @RequestBody SalaryAssignmentRequest request) {
        salaryService.assignSalaryToEmployee(request);
        return ResponseEntity.ok(ApiResponse.success("Salary structure assigned to employee successfully"));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get Employee Active Salary", description = "Fetches active salary structure assigned to an employee")
    public ResponseEntity<ApiResponse<SalaryStructureDto>> getActiveSalaryForEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success("Active salary structure fetched", salaryService.getActiveSalaryForEmployee(employeeId)));
    }

    @GetMapping("/employee/{employeeId}/history")
    @Operation(summary = "Get Employee Salary History", description = "Fetches complete salary structure history for an employee")
    public ResponseEntity<ApiResponse<List<SalaryStructureDto>>> getEmployeeSalaryHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success("Salary history fetched", salaryService.getEmployeeSalaryHistory(employeeId)));
    }
}
