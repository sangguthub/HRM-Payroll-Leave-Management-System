package com.example.hrm.dto.leave;

import com.example.hrm.enums.LeaveType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalanceDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LeaveType leaveType;
    private Integer year;
    private Integer allocated;
    private Integer used;
    private Integer remaining;
}
