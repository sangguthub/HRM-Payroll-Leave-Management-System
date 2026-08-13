package com.example.hrm.dto.leave;

import com.example.hrm.enums.LeaveType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeavePolicyDto {
    private Long id;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "Annual allocation is required")
    @PositiveOrZero(message = "Allocation must be zero or positive")
    private Integer annualAllocation;

    private String description;
    private Boolean active;
}
