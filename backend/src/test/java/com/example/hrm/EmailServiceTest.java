package com.example.hrm;

import com.example.hrm.dto.email.EmailLogResponseDto;
import com.example.hrm.entity.EmailDeliveryLog;
import com.example.hrm.entity.Employee;
import com.example.hrm.entity.Payroll;
import com.example.hrm.entity.Payslip;
import com.example.hrm.enums.EmailStatus;
import com.example.hrm.exception.BadRequestException;
import com.example.hrm.repository.EmailDeliveryLogRepository;
import com.example.hrm.service.impl.EmailServiceImpl;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private EmailDeliveryLogRepository emailLogRepository;

    @InjectMocks
    private EmailServiceImpl emailService;

    private Employee employee;
    private Payroll payroll;
    private Payslip payslip;
    private EmailDeliveryLog emailLog;

    @BeforeEach
    void setUp() {
        employee = Employee.builder()
                .id(1L)
                .employeeCode("EMP001")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .build();

        payroll = Payroll.builder()
                .id(1L)
                .payPeriodMonth(1)
                .payPeriodYear(2026)
                .build();

        payslip = Payslip.builder()
                .id(1L)
                .employee(employee)
                .payroll(payroll)
                .filePath("./payslips/Payslip_EMP001_1_2026.pdf")
                .build();

        emailLog = EmailDeliveryLog.builder()
                .id(10L)
                .employee(employee)
                .payslip(payslip)
                .recipientEmail(employee.getEmail())
                .subject("Payslip for January 2026")
                .status(EmailStatus.FAILED)
                .retryCount(0)
                .build();
    }

    @Test
    void testSendPayslipEmail_Success() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(emailLogRepository.save(any(EmailDeliveryLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmailDeliveryLog result = emailService.sendPayslipEmail(payslip);

        assertNotNull(result);
        assertEquals(EmailStatus.SENT, result.getStatus());
        assertNotNull(result.getSentAt());
        assertNull(result.getFailureReason());
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void testSendPayslipEmail_FailureHandledGracefully() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new MailSendException("SMTP Authentication Failed")).when(mailSender).send(any(MimeMessage.class));
        when(emailLogRepository.save(any(EmailDeliveryLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmailDeliveryLog result = emailService.sendPayslipEmail(payslip);

        assertNotNull(result);
        assertEquals(EmailStatus.FAILED, result.getStatus());
        assertNotNull(result.getFailureReason());
        assertTrue(result.getFailureReason().contains("SMTP Authentication Failed"));
    }

    @Test
    void testRetryFailedEmail_Success() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailLogRepository.findById(10L)).thenReturn(Optional.of(emailLog));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(emailLogRepository.save(any(EmailDeliveryLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmailDeliveryLog result = emailService.retryFailedEmail(10L);

        assertNotNull(result);
        assertEquals(1, result.getRetryCount());
        assertEquals(EmailStatus.SENT, result.getStatus());
    }

    @Test
    void testRetryFailedEmail_MaxRetriesExceeded() {
        emailLog.setRetryCount(3);
        when(emailLogRepository.findById(10L)).thenReturn(Optional.of(emailLog));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> emailService.retryFailedEmail(10L));
        assertTrue(ex.getMessage().contains("Maximum retry attempts"));
    }

    @Test
    void testRetryAllFailedEmails() {
        when(emailLogRepository.findByStatusAndRetryCountLessThan(EmailStatus.FAILED, 3))
                .thenReturn(Collections.singletonList(emailLog));
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        int count = emailService.retryAllFailedEmails();

        assertEquals(1, count);
        verify(emailLogRepository, times(1)).save(any(EmailDeliveryLog.class));
    }
}
