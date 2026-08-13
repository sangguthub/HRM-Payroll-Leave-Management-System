package com.example.hrm.dto.email;

import com.example.hrm.enums.EmailStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailLogResponseDto {
    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private Long payslipId;
    private String recipientEmail;
    private String subject;
    private EmailStatus status;
    private LocalDateTime sentAt;
    private String failureReason;
    private Integer retryCount;
}
