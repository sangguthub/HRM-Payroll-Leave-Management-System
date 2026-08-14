package com.example.hrm.service;

import com.example.hrm.dto.email.EmailLogResponseDto;
import com.example.hrm.entity.EmailDeliveryLog;
import com.example.hrm.entity.Payslip;

import java.util.List;

public interface EmailService {
    EmailDeliveryLog sendPayslipEmail(Payslip payslip);
    EmailDeliveryLog sendPayslipEmailByPayslipId(Long payslipId);
    EmailDeliveryLog retryFailedEmail(Long emailLogId);
    List<EmailLogResponseDto> getAllEmailLogs();
    List<EmailLogResponseDto> getEmployeeEmailLogs(Long employeeId);
    int retryAllFailedEmails();
}
