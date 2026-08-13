package com.example.hrm.controller;

import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.dto.payroll.PayrollProcessRequest;
import com.example.hrm.dto.payroll.PayrollResponseDto;
import com.example.hrm.security.UserPrincipal;
import com.example.hrm.service.ExportService;
import com.example.hrm.service.PayrollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@Tag(name = "Payroll Processing", description = "APIs for Processing Payroll, Financial Export, and Payslip ZIP Archiving")
public class PayrollController {

    private final PayrollService payrollService;
    private final ExportService exportService;
    private final com.example.hrm.repository.EmployeeRepository employeeRepository;

    @PostMapping("/process")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Process Monthly Payroll", description = "Executes payroll for active employees, generates PDFs, and sends emails automatically")
    public ResponseEntity<ApiResponse<List<PayrollResponseDto>>> processPayroll(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PayrollProcessRequest request) {
        Long processorId = principal != null ? principal.getId() : null;
        List<PayrollResponseDto> response = payrollService.processMonthlyPayroll(request, processorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Monthly payroll processed successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Get Payroll Records by Month/Year", description = "Fetches processed payroll for a specific month and year")
    public ResponseEntity<ApiResponse<List<PayrollResponseDto>>> getPayroll(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(ApiResponse.success("Payroll records fetched", payrollService.getPayrollByMonthAndYear(month, year)));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get Employee Payroll History", description = "Fetches payroll history for a specific employee")
    public ResponseEntity<ApiResponse<List<PayrollResponseDto>>> getEmployeePayrollHistory(
            @PathVariable Long employeeId,
            @AuthenticationPrincipal UserPrincipal principal) {
        boolean isHrOrAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_HR") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isHrOrAdmin) {
            com.example.hrm.entity.Employee loggedInEmp = employeeRepository.findByUserId(principal.getId()).orElse(null);
            if (loggedInEmp == null || !loggedInEmp.getId().equals(employeeId)) {
                throw new org.springframework.security.access.AccessDeniedException("Unauthorized: You can only view your own payroll history");
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Employee payroll history fetched", payrollService.getEmployeePayrollHistory(employeeId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Payroll Record by ID", description = "Retrieves single payroll details")
    public ResponseEntity<ApiResponse<PayrollResponseDto>> getPayrollById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Payroll details fetched", payrollService.getPayrollById(id)));
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Export Monthly Payroll to Excel", description = "Downloads monthly payroll in .xlsx format using Apache POI")
    public ResponseEntity<InputStreamResource> exportToExcel(@RequestParam Integer month, @RequestParam Integer year) {
        ByteArrayInputStream stream = exportService.exportMonthlyPayrollToExcel(month, year);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Monthly_Payroll_" + month + "_" + year + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/export/zip")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Export Monthly Payslips ZIP Archive", description = "Downloads all generated PDF payslips for a month in a ZIP file")
    public ResponseEntity<InputStreamResource> exportToZip(@RequestParam Integer month, @RequestParam Integer year) {
        ByteArrayInputStream stream = exportService.exportMonthlyPayslipsToZip(month, year);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Payslips_" + month + "_" + year + ".zip");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(new InputStreamResource(stream));
    }
}
