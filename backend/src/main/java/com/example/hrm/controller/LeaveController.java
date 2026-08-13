package com.example.hrm.controller;

import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.dto.leave.*;
import com.example.hrm.entity.Employee;
import com.example.hrm.enums.LeaveStatus;
import com.example.hrm.repository.EmployeeRepository;
import com.example.hrm.security.UserPrincipal;
import com.example.hrm.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
@Tag(name = "Leave Management", description = "APIs for Leave Policies, Applications, Approvals, and Balances")
public class LeaveController {

    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    @GetMapping("/policies")
    @Operation(summary = "Get Leave Policies", description = "Fetches configured leave policies (CL, SL, EL)")
    public ResponseEntity<ApiResponse<List<LeavePolicyDto>>> getPolicies() {
        return ResponseEntity.ok(ApiResponse.success("Policies fetched", leaveService.getAllPolicies()));
    }

    @PutMapping("/policies/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Update Leave Policy", description = "HR can update annual allocations")
    public ResponseEntity<ApiResponse<LeavePolicyDto>> updatePolicy(@PathVariable Long id, @Valid @RequestBody LeavePolicyDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Policy updated", leaveService.updatePolicy(id, dto)));
    }

    @GetMapping("/balances")
    @Operation(summary = "Get Leave Balances", description = "Fetches leave balances by employee ID or all employees")
    public ResponseEntity<ApiResponse<List<LeaveBalanceDto>>> getBalances(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Integer year) {
        if (employeeId != null) {
            return ResponseEntity.ok(ApiResponse.success("Employee leave balances fetched", leaveService.getEmployeeBalances(employeeId, year)));
        } else {
            return ResponseEntity.ok(ApiResponse.success("All leave balances fetched", leaveService.getAllBalancesForYear(year)));
        }
    }

    @PostMapping
    @Operation(summary = "Apply for Leave", description = "Employee submits a leave application")
    public ResponseEntity<ApiResponse<LeaveResponseDto>> applyLeave(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LeaveRequestDto request) {
        Long empId = request.getEmployeeId();
        if (empId == null && principal != null) {
            Employee emp = employeeRepository.findByUserId(principal.getId())
                    .orElseThrow(() -> new RuntimeException("Employee record not found for logged in user"));
            empId = emp.getId();
        }
        LeaveResponseDto response = leaveService.applyLeave(empId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Leave application submitted successfully", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get My Leaves", description = "Logged in employee views their leave history")
    public ResponseEntity<ApiResponse<List<LeaveResponseDto>>> getMyLeaves(@AuthenticationPrincipal UserPrincipal principal) {
        Employee emp = employeeRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new RuntimeException("Employee record not found for logged in user"));
        return ResponseEntity.ok(ApiResponse.success("Leave history fetched", leaveService.getMyLeaves(emp.getId())));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Get All Leave Applications", description = "HR views leave applications filterable by status")
    public ResponseEntity<ApiResponse<List<LeaveResponseDto>>> getAllLeaves(@RequestParam(required = false) LeaveStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Leave applications fetched", leaveService.getAllLeaves(status)));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Approve Leave", description = "HR approves leave application and deducts balance")
    public ResponseEntity<ApiResponse<LeaveResponseDto>> approveLeave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long approverId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success("Leave approved successfully", leaveService.approveLeave(id, approverId)));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Reject Leave", description = "HR rejects leave application with reason")
    public ResponseEntity<ApiResponse<LeaveResponseDto>> rejectLeave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody(required = false) LeaveApprovalRequest body) {
        Long approverId = principal != null ? principal.getId() : null;
        String reason = body != null ? body.getRejectionReason() : "Not specified";
        return ResponseEntity.ok(ApiResponse.success("Leave rejected", leaveService.rejectLeave(id, approverId, reason)));
    }
}
