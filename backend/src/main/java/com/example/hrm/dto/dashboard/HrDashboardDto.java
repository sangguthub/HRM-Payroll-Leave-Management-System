package com.example.hrm.dto.dashboard;

import com.example.hrm.dto.email.EmailLogResponseDto;
import com.example.hrm.dto.leave.LeaveBalanceDto;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HrDashboardDto {
    private Long totalEmployees;
    private Long payrollProcessed;
    private Long pendingPayroll;
    private Long payslipsSent;
    private Long failedEmails;

    private Integer totalClUsed;
    private Integer totalSlUsed;
    private Integer totalElUsed;

    private BigDecimal totalGrossSalary;
    private BigDecimal totalDeductions;
    private BigDecimal totalNetSalary;

    private List<EmailLogResponseDto> recentEmailLogs;
    private List<LeaveBalanceDto> employeeLeaveBalances;
}
