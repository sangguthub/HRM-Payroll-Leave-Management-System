package com.example.hrm;

import com.example.hrm.dto.leave.LeaveRequestDto;
import com.example.hrm.dto.leave.LeaveResponseDto;
import com.example.hrm.entity.Employee;
import com.example.hrm.entity.EmployeeLeaveBalance;
import com.example.hrm.entity.LeaveApplication;
import com.example.hrm.enums.LeaveStatus;
import com.example.hrm.enums.LeaveType;
import com.example.hrm.exception.BadRequestException;
import com.example.hrm.exception.LeaveBalanceException;
import com.example.hrm.repository.*;
import com.example.hrm.service.impl.LeaveServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock private LeavePolicyRepository policyRepository;
    @Mock private EmployeeLeaveBalanceRepository balanceRepository;
    @Mock private LeaveApplicationRepository applicationRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private LeaveServiceImpl leaveService;

    private Employee employee;
    private EmployeeLeaveBalance balance;

    @BeforeEach
    void setUp() {
        employee = Employee.builder().id(1L).employeeCode("EMP001").firstName("Rahul").lastName("Sharma").build();
        balance = EmployeeLeaveBalance.builder().id(1L).employee(employee).leaveType(LeaveType.CL).year(2026).allocated(12).used(2).remaining(10).build();
    }

    @Test
    @DisplayName("Should throw BadRequestException if From Date is after To Date")
    void testInvalidDateRange() {
        LeaveRequestDto request = LeaveRequestDto.builder()
                .leaveType(LeaveType.CL)
                .fromDate(LocalDate.of(2026, 8, 10))
                .toDate(LocalDate.of(2026, 8, 5))
                .reason("Vacation")
                .build();

        assertThrows(BadRequestException.class, () -> leaveService.applyLeave(1L, request));
    }

    @Test
    @DisplayName("Should throw LeaveBalanceException when requesting more days than remaining")
    void testInsufficientLeaveBalance() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(balanceRepository.findByEmployeeIdAndLeaveTypeAndYear(1L, LeaveType.CL, 2026)).thenReturn(Optional.of(balance));

        LeaveRequestDto request = LeaveRequestDto.builder()
                .leaveType(LeaveType.CL)
                .fromDate(LocalDate.of(2026, 8, 1))
                .toDate(LocalDate.of(2026, 8, 15)) // 15 days requested, remaining is 10
                .reason("Long vacation")
                .build();

        assertThrows(LeaveBalanceException.class, () -> leaveService.applyLeave(1L, request));
    }

    @Test
    @DisplayName("Should deduct leave balance upon HR approval")
    void testApproveLeaveDeduction() {
        LeaveApplication application = LeaveApplication.builder()
                .id(100L)
                .employee(employee)
                .leaveType(LeaveType.CL)
                .fromDate(LocalDate.of(2026, 8, 1))
                .toDate(LocalDate.of(2026, 8, 3))
                .numberOfDays(3)
                .reason("Casual leave")
                .status(LeaveStatus.PENDING)
                .build();

        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(balanceRepository.findByEmployeeIdAndLeaveTypeAndYear(1L, LeaveType.CL, 2026)).thenReturn(Optional.of(balance));
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        LeaveResponseDto result = leaveService.approveLeave(100L, 2L);

        assertEquals(LeaveStatus.APPROVED, result.getStatus());
        assertEquals(5, balance.getUsed()); // 2 + 3 = 5
        assertEquals(7, balance.getRemaining()); // 12 - 5 = 7
        verify(balanceRepository, times(1)).save(balance);
    }
}
