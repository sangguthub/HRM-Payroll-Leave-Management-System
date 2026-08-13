package com.example.hrm.service;

import com.example.hrm.dto.leave.*;
import com.example.hrm.enums.LeaveStatus;

import java.util.List;

public interface LeaveService {
    List<LeavePolicyDto> getAllPolicies();
    LeavePolicyDto updatePolicy(Long id, LeavePolicyDto dto);

    List<LeaveBalanceDto> getEmployeeBalances(Long employeeId, Integer year);
    List<LeaveBalanceDto> getAllBalancesForYear(Integer year);

    LeaveResponseDto applyLeave(Long employeeId, LeaveRequestDto request);
    List<LeaveResponseDto> getMyLeaves(Long employeeId);
    List<LeaveResponseDto> getAllLeaves(LeaveStatus status);
    LeaveResponseDto approveLeave(Long leaveId, Long approverUserId);
    LeaveResponseDto rejectLeave(Long leaveId, Long approverUserId, String rejectionReason);
}
