package com.example.hrm.service.impl;

import com.example.hrm.dto.leave.*;
import com.example.hrm.entity.*;
import com.example.hrm.enums.LeaveStatus;
import com.example.hrm.exception.BadRequestException;
import com.example.hrm.exception.EmployeeNotFoundException;
import com.example.hrm.exception.LeaveBalanceException;
import com.example.hrm.exception.ResourceNotFoundException;
import com.example.hrm.repository.*;
import com.example.hrm.service.LeaveService;
import com.example.hrm.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeavePolicyRepository policyRepository;
    private final EmployeeLeaveBalanceRepository balanceRepository;
    private final LeaveApplicationRepository applicationRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public List<LeavePolicyDto> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(p -> LeavePolicyDto.builder()
                        .id(p.getId())
                        .leaveType(p.getLeaveType())
                        .annualAllocation(p.getAnnualAllocation())
                        .description(p.getDescription())
                        .active(p.getActive())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LeavePolicyDto updatePolicy(Long id, LeavePolicyDto dto) {
        LeavePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Policy not found with ID: " + id));

        policy.setAnnualAllocation(dto.getAnnualAllocation());
        if (dto.getDescription() != null) policy.setDescription(dto.getDescription());
        if (dto.getActive() != null) policy.setActive(dto.getActive());

        LeavePolicy updated = policyRepository.save(policy);
        return LeavePolicyDto.builder()
                .id(updated.getId())
                .leaveType(updated.getLeaveType())
                .annualAllocation(updated.getAnnualAllocation())
                .description(updated.getDescription())
                .active(updated.getActive())
                .build();
    }

    @Override
    public List<LeaveBalanceDto> getEmployeeBalances(Long employeeId, Integer year) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        return balanceRepository.findByEmployeeIdAndYear(employeeId, targetYear).stream()
                .map(this::mapToBalanceDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveBalanceDto> getAllBalancesForYear(Integer year) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        return balanceRepository.findByYear(targetYear).stream()
                .map(this::mapToBalanceDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LeaveResponseDto applyLeave(Long employeeId, LeaveRequestDto request) {
        if (request.getFromDate().isAfter(request.getToDate())) {
            throw new BadRequestException("From Date cannot be after To Date");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with ID: " + employeeId));

        int days = (int) ChronoUnit.DAYS.between(request.getFromDate(), request.getToDate()) + 1;
        int currentYear = request.getFromDate().getYear();

        EmployeeLeaveBalance balance = balanceRepository.findByEmployeeIdAndLeaveTypeAndYear(employeeId, request.getLeaveType(), currentYear)
                .orElseThrow(() -> new LeaveBalanceException("No leave balance found for type " + request.getLeaveType() + " in year " + currentYear));

        if (balance.getRemaining() < days) {
            throw new LeaveBalanceException("Insufficient leave balance. Available: " + balance.getRemaining() + " days, Requested: " + days + " days.");
        }

        LeaveApplication application = LeaveApplication.builder()
                .employee(employee)
                .leaveType(request.getLeaveType())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .numberOfDays(days)
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        LeaveApplication saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    @Override
    public List<LeaveResponseDto> getMyLeaves(Long employeeId) {
        return applicationRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveResponseDto> getAllLeaves(LeaveStatus status) {
        List<LeaveApplication> list = status != null ?
                applicationRepository.findByStatus(status) :
                applicationRepository.findAll();
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LeaveResponseDto approveLeave(Long leaveId, Long approverUserId) {
        LeaveApplication application = applicationRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave application not found with ID: " + leaveId));

        if (application.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only PENDING leave applications can be approved. Current status: " + application.getStatus());
        }

        int currentYear = application.getFromDate().getYear();
        EmployeeLeaveBalance balance = balanceRepository.findByEmployeeIdAndLeaveTypeAndYear(
                        application.getEmployee().getId(), application.getLeaveType(), currentYear)
                .orElseThrow(() -> new LeaveBalanceException("Leave balance record not found"));

        if (balance.getRemaining() < application.getNumberOfDays()) {
            throw new LeaveBalanceException("Cannot approve: Available balance (" + balance.getRemaining() + ") is less than requested days (" + application.getNumberOfDays() + ")");
        }

        // Deduct balance on approval
        balance.setUsed(balance.getUsed() + application.getNumberOfDays());
        balance.setRemaining(balance.getAllocated() - balance.getUsed());
        balanceRepository.save(balance);

        User approver = approverUserId != null ? userRepository.findById(approverUserId).orElse(null) : null;

        application.setStatus(LeaveStatus.APPROVED);
        application.setApprovedAt(LocalDateTime.now());
        application.setApprovedBy(approver);

        LeaveApplication updated = applicationRepository.save(application);

        // Auto-trigger in-app notification to employee
        if (application.getEmployee().getUser() != null) {
            notificationService.createNotification(
                    application.getEmployee().getUser(),
                    "Leave Request Approved",
                    "Your " + application.getLeaveType() + " leave request for " + application.getNumberOfDays() + " day(s) (" + application.getFromDate() + " to " + application.getToDate() + ") has been approved.",
                    com.example.hrm.enums.NotificationType.LEAVE_APPROVED
            );
        }

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public LeaveResponseDto rejectLeave(Long leaveId, Long approverUserId, String rejectionReason) {
        LeaveApplication application = applicationRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave application not found with ID: " + leaveId));

        if (application.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only PENDING leave applications can be rejected");
        }

        User approver = approverUserId != null ? userRepository.findById(approverUserId).orElse(null) : null;

        application.setStatus(LeaveStatus.REJECTED);
        application.setApprovedAt(LocalDateTime.now());
        application.setApprovedBy(approver);
        application.setRejectionReason(rejectionReason);

        LeaveApplication updated = applicationRepository.save(application);

        // Auto-trigger in-app notification to employee
        if (application.getEmployee().getUser() != null) {
            notificationService.createNotification(
                    application.getEmployee().getUser(),
                    "Leave Request Rejected",
                    "Your " + application.getLeaveType() + " leave request for " + application.getFromDate() + " was rejected. Reason: " + (rejectionReason != null ? rejectionReason : "Not specified"),
                    com.example.hrm.enums.NotificationType.LEAVE_REJECTED
            );
        }

        return mapToResponse(updated);
    }

    private LeaveBalanceDto mapToBalanceDto(EmployeeLeaveBalance b) {
        return LeaveBalanceDto.builder()
                .id(b.getId())
                .employeeId(b.getEmployee().getId())
                .employeeName(b.getEmployee().getFirstName() + " " + b.getEmployee().getLastName())
                .leaveType(b.getLeaveType())
                .year(b.getYear())
                .allocated(b.getAllocated())
                .used(b.getUsed())
                .remaining(b.getRemaining())
                .build();
    }

    private LeaveResponseDto mapToResponse(LeaveApplication app) {
        return LeaveResponseDto.builder()
                .id(app.getId())
                .employeeId(app.getEmployee().getId())
                .employeeCode(app.getEmployee().getEmployeeCode())
                .employeeName(app.getEmployee().getFirstName() + " " + app.getEmployee().getLastName())
                .leaveType(app.getLeaveType())
                .fromDate(app.getFromDate())
                .toDate(app.getToDate())
                .numberOfDays(app.getNumberOfDays())
                .reason(app.getReason())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .approvedAt(app.getApprovedAt())
                .approvedByName(app.getApprovedBy() != null ? app.getApprovedBy().getName() : null)
                .rejectionReason(app.getRejectionReason())
                .build();
    }
}
