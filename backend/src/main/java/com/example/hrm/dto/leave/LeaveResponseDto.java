package com.example.hrm.dto.leave;

import com.example.hrm.enums.LeaveStatus;
import com.example.hrm.enums.LeaveType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveResponseDto {
    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private LeaveType leaveType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer numberOfDays;
    private String reason;
    private LeaveStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;
    private String approvedByName;
    private String rejectionReason;
}
