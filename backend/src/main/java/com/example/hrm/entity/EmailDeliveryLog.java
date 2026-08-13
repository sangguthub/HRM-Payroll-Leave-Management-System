package com.example.hrm.entity;

import com.example.hrm.enums.EmailStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_delivery_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailDeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payslip_id", nullable = false)
    private Payslip payslip;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Column(nullable = false)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EmailStatus status = EmailStatus.PENDING;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private Integer retryCount = 0;
}
