package com.example.hrm.dto.payslip;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayslipResponseDto {
    private Long id;
    private Long payrollId;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String payPeriodFormatted;
    private String fileName;
    private LocalDateTime generatedAt;
}
