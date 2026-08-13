package com.example.hrm.dto.dashboard;

import com.example.hrm.dto.employee.EmployeeResponse;
import com.example.hrm.dto.leave.LeaveBalanceDto;
import com.example.hrm.dto.payroll.PayrollResponseDto;
import com.example.hrm.dto.salary.SalaryStructureDto;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDashboardDto {
    private EmployeeResponse profile;
    private List<LeaveBalanceDto> leaveBalances;
    private SalaryStructureDto currentSalaryStructure;
    private List<PayrollResponseDto> recentPayslips;
}
