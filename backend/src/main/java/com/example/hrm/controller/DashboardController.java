package com.example.hrm.controller;

import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.dto.dashboard.EmployeeDashboardDto;
import com.example.hrm.dto.dashboard.HrDashboardDto;
import com.example.hrm.security.UserPrincipal;
import com.example.hrm.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "APIs for HR & Employee Summary Metrics")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/hr")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Get HR Dashboard Metrics", description = "Aggregates employee, payroll, email, and leave statistics for HR")
    public ResponseEntity<ApiResponse<HrDashboardDto>> getHrDashboard() {
        return ResponseEntity.ok(ApiResponse.success("HR Dashboard metrics fetched", dashboardService.getHrDashboardData()));
    }

    @GetMapping("/employee")
    @Operation(summary = "Get Employee Dashboard Metrics", description = "Aggregates personal profile, leave balances, salary, and payslips for logged in employee")
    public ResponseEntity<ApiResponse<EmployeeDashboardDto>> getEmployeeDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success("Employee Dashboard metrics fetched", dashboardService.getEmployeeDashboardData(principal.getId())));
    }
}
