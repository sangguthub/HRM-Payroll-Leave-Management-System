package com.example.hrm.controller;

import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.dto.email.EmailLogResponseDto;
import com.example.hrm.entity.EmailDeliveryLog;
import com.example.hrm.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/email-delivery")
@RequiredArgsConstructor
@Tag(name = "Email Delivery Audit Logs", description = "APIs for tracking and retrying automated email deliveries")
public class EmailLogController {

    private final EmailService emailService;

    @GetMapping("/logs")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Get Email Delivery Logs", description = "Fetches complete audit log of sent and failed payslip emails")
    public ResponseEntity<ApiResponse<List<EmailLogResponseDto>>> getLogs() {
        return ResponseEntity.ok(ApiResponse.success("Email delivery logs fetched", emailService.getAllEmailLogs()));
    }

    @PostMapping("/{id}/retry")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Retry Failed Email", description = "Manually retries sending a failed payslip email (max 3 retries)")
    public ResponseEntity<ApiResponse<EmailLogResponseDto>> retryEmail(@PathVariable Long id) {
        EmailDeliveryLog log = emailService.retryFailedEmail(id);
        return ResponseEntity.ok(ApiResponse.success("Email retry attempt executed", mapToDto(log)));
    }

    @PostMapping("/payslip/{payslipId}/send")
    @PreAuthorize("hasAnyAuthority('ROLE_HR', 'ROLE_ADMIN')")
    @Operation(summary = "Send Payslip Email", description = "Manually sends or resends a payslip email to an employee")
    public ResponseEntity<ApiResponse<EmailLogResponseDto>> sendPayslipEmail(@PathVariable Long payslipId) {
        EmailDeliveryLog log = emailService.sendPayslipEmailByPayslipId(payslipId);
        return ResponseEntity.ok(ApiResponse.success("Payslip email dispatch executed", mapToDto(log)));
    }

    private EmailLogResponseDto mapToDto(EmailDeliveryLog log) {
        return EmailLogResponseDto.builder()
                .id(log.getId())
                .employeeId(log.getEmployee().getId())
                .employeeCode(log.getEmployee().getEmployeeCode())
                .employeeName(log.getEmployee().getFirstName() + " " + log.getEmployee().getLastName())
                .payslipId(log.getPayslip().getId())
                .recipientEmail(log.getRecipientEmail())
                .subject(log.getSubject())
                .status(log.getStatus())
                .sentAt(log.getSentAt())
                .failureReason(log.getFailureReason())
                .retryCount(log.getRetryCount())
                .build();
    }
}
