package com.example.hrm.dto.leave;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveApprovalRequest {
    private String rejectionReason;
}
