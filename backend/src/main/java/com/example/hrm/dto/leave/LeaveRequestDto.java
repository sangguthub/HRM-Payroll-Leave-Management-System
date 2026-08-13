package com.example.hrm.dto.leave;

import com.example.hrm.enums.LeaveType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequestDto {
    private Long employeeId;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "From date is required")
    private LocalDate fromDate;

    @NotNull(message = "To date is required")
    private LocalDate toDate;

    @NotBlank(message = "Reason is required")
    private String reason;
}
