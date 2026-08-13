package com.example.hrm.scheduler;

import com.example.hrm.dto.payroll.PayrollProcessRequest;
import com.example.hrm.service.EmailService;
import com.example.hrm.service.PayrollService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class PayrollScheduler {

    private final PayrollService payrollService;
    private final EmailService emailService;

    // Run automatically on the 1st day of every month at 01:00 AM
    @Scheduled(cron = "${app.payroll.cron:0 0 1 1 * ?}")
    public void scheduleMonthlyPayroll() {
        log.info("Executing scheduled monthly payroll processing job...");
        LocalDate previousMonthDate = LocalDate.now().minusMonths(1);
        int month = previousMonthDate.getMonthValue();
        int year = previousMonthDate.getYear();

        try {
            PayrollProcessRequest request = PayrollProcessRequest.builder()
                    .month(month)
                    .year(year)
                    .build();
            payrollService.processMonthlyPayroll(request, null);
            log.info("Scheduled monthly payroll completed for {}/{}", month, year);
        } catch (Exception e) {
            log.error("Scheduled monthly payroll failed: {}", e.getMessage());
        }
    }

    // Automatically retry failed emails every 30 minutes
    @Scheduled(cron = "0 */30 * * * ?")
    public void scheduleFailedEmailRetry() {
        log.info("Executing scheduled failed email retry job...");
        try {
            int retriedCount = emailService.retryAllFailedEmails();
            if (retriedCount > 0) {
                log.info("Retried sending {} failed payslip emails.", retriedCount);
            }
        } catch (Exception e) {
            log.error("Scheduled email retry failed: {}", e.getMessage());
        }
    }
}
