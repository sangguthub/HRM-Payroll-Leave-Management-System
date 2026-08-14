package com.example.hrm.service.impl;

import com.example.hrm.dto.email.EmailLogResponseDto;
import com.example.hrm.entity.EmailDeliveryLog;
import com.example.hrm.entity.Employee;
import com.example.hrm.entity.Payslip;
import com.example.hrm.enums.EmailStatus;
import com.example.hrm.exception.BadRequestException;
import com.example.hrm.exception.ResourceNotFoundException;
import com.example.hrm.repository.EmailDeliveryLogRepository;
import com.example.hrm.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final EmailDeliveryLogRepository emailLogRepository;
    private final com.example.hrm.repository.PayslipRepository payslipRepository;

    @Override
    @Transactional
    public EmailDeliveryLog sendPayslipEmail(Payslip payslip) {
        Employee emp = payslip.getEmployee();
        String monthName = Month.of(payslip.getPayroll().getPayPeriodMonth()).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        String subject = "Payslip for " + monthName + " " + payslip.getPayroll().getPayPeriodYear();

        EmailDeliveryLog emailLog = EmailDeliveryLog.builder()
                .employee(emp)
                .payslip(payslip)
                .recipientEmail(emp.getEmail())
                .subject(subject)
                .status(EmailStatus.PENDING)
                .retryCount(0)
                .build();

        return executeSendEmail(emailLog, payslip.getFilePath());
    }

    @Override
    @Transactional
    public EmailDeliveryLog sendPayslipEmailByPayslipId(Long payslipId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new ResourceNotFoundException("Payslip not found with ID: " + payslipId));

        EmailDeliveryLog existingLog = emailLogRepository.findTopByPayslipIdOrderByIdDesc(payslipId).orElse(null);
        if (existingLog != null) {
            existingLog.setRetryCount(existingLog.getRetryCount() + 1);
            return executeSendEmail(existingLog, payslip.getFilePath());
        }

        return sendPayslipEmail(payslip);
    }

    @Override
    @Transactional
    public EmailDeliveryLog retryFailedEmail(Long emailLogId) {
        EmailDeliveryLog emailLog = emailLogRepository.findById(emailLogId)
                .orElseThrow(() -> new ResourceNotFoundException("Email delivery log not found with ID: " + emailLogId));

        if (emailLog.getStatus() == EmailStatus.SENT) {
            throw new BadRequestException("Email has already been sent successfully.");
        }

        if (emailLog.getRetryCount() >= 3) {
            throw new BadRequestException("Maximum retry attempts (3) exceeded for this email.");
        }

        emailLog.setRetryCount(emailLog.getRetryCount() + 1);
        return executeSendEmail(emailLog, emailLog.getPayslip().getFilePath());
    }

    @Override
    @Transactional
    public int retryAllFailedEmails() {
        List<EmailDeliveryLog> failedLogs = emailLogRepository.findByStatusAndRetryCountLessThan(EmailStatus.FAILED, 3);
        int count = 0;
        for (EmailDeliveryLog logItem : failedLogs) {
            logItem.setRetryCount(logItem.getRetryCount() + 1);
            executeSendEmail(logItem, logItem.getPayslip().getFilePath());
            count++;
        }
        return count;
    }

    @org.springframework.beans.factory.annotation.Value("${app.mail.mock-mode:true}")
    private boolean mockMode;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.password:mock-app-password}")
    private String mailPassword;

    private EmailDeliveryLog executeSendEmail(EmailDeliveryLog emailLog, String attachmentFilePath) {
        try {
            if (mockMode || (mailPassword != null && mailPassword.toLowerCase().contains("mock"))) {
                emailLog.setStatus(EmailStatus.SENT);
                emailLog.setSentAt(LocalDateTime.now());
                emailLog.setFailureReason(null);
                log.info("Payslip email sent successfully (Mock Mode active) to {}", emailLog.getRecipientEmail());
                return emailLogRepository.save(emailLog);
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(emailLog.getRecipientEmail());
            helper.setSubject(emailLog.getSubject());

            String body = "Dear " + emailLog.getEmployee().getFirstName() + ",\n\n" +
                    "Your payslip for " + emailLog.getSubject().replace("Payslip for ", "") + " has been generated successfully.\n\n" +
                    "Please find your official payslip attached as a PDF.\n\n" +
                    "Regards,\n" +
                    "HR Team\n" +
                    "ACME Corporation";

            helper.setText(body);

            File file = new File(attachmentFilePath);
            if (file.exists()) {
                helper.addAttachment(file.getName(), new FileSystemResource(file));
            }

            mailSender.send(message);

            emailLog.setStatus(EmailStatus.SENT);
            emailLog.setSentAt(LocalDateTime.now());
            emailLog.setFailureReason(null);
            log.info("Payslip email sent successfully to {}", emailLog.getRecipientEmail());

        } catch (Exception e) {
            log.error("Failed to send payslip email to {}: {}", emailLog.getRecipientEmail(), e.getMessage());
            emailLog.setStatus(EmailStatus.FAILED);
            emailLog.setFailureReason(e.getMessage());
        }

        return emailLogRepository.save(emailLog);
    }

    @Override
    public List<EmailLogResponseDto> getAllEmailLogs() {
        return emailLogRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmailLogResponseDto> getEmployeeEmailLogs(Long employeeId) {
        return emailLogRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
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
