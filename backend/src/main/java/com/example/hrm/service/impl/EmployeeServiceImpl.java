package com.example.hrm.service.impl;

import com.example.hrm.dto.employee.EmployeeRequest;
import com.example.hrm.dto.employee.EmployeeResponse;
import com.example.hrm.entity.*;
import com.example.hrm.enums.EmployeeStatus;
import com.example.hrm.enums.LeaveType;
import com.example.hrm.enums.Role;
import com.example.hrm.exception.BadRequestException;
import com.example.hrm.exception.EmployeeNotFoundException;
import com.example.hrm.exception.ResourceNotFoundException;
import com.example.hrm.repository.*;
import com.example.hrm.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final LeavePolicyRepository leavePolicyRepository;
    private final EmployeeLeaveBalanceRepository leaveBalanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BadRequestException("Employee Code already exists: " + request.getEmployeeCode());
        }

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Employee email already exists: " + request.getEmail());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        // Check if user exists or create User account for employee login
        User user = userRepository.findByEmail(request.getEmail()).orElseGet(() -> {
            String rawPassword = request.getPassword() != null ? request.getPassword() : "Employee@123";
            User newUser = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(rawPassword))
                    .name(request.getFirstName() + " " + request.getLastName())
                    .role(Role.ROLE_EMPLOYEE)
                    .active(true)
                    .build();
            return userRepository.save(newUser);
        });

        Employee employee = Employee.builder()
                .employeeCode(request.getEmployeeCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfJoining(request.getDateOfJoining())
                .department(department)
                .designation(request.getDesignation())
                .status(request.getStatus() != null ? request.getStatus() : EmployeeStatus.ACTIVE)
                .user(user)
                .build();

        Employee saved = employeeRepository.save(employee);

        // Initialize Leave Balances for current year based on active Leave Policies
        int currentYear = LocalDate.now().getYear();
        List<LeavePolicy> policies = leavePolicyRepository.findByActiveTrue();
        if (policies.isEmpty()) {
            // Default allocations if policies not explicitly created yet
            createDefaultLeaveBalance(saved, LeaveType.CL, 12, currentYear);
            createDefaultLeaveBalance(saved, LeaveType.SL, 12, currentYear);
            createDefaultLeaveBalance(saved, LeaveType.EL, 15, currentYear);
        } else {
            for (LeavePolicy policy : policies) {
                createDefaultLeaveBalance(saved, policy.getLeaveType(), policy.getAnnualAllocation(), currentYear);
            }
        }

        return mapToResponse(saved);
    }

    private void createDefaultLeaveBalance(Employee employee, LeaveType type, int allocation, int year) {
        EmployeeLeaveBalance balance = EmployeeLeaveBalance.builder()
                .employee(employee)
                .leaveType(type)
                .year(year)
                .allocated(allocation)
                .used(0)
                .remaining(allocation)
                .build();
        leaveBalanceRepository.save(balance);
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with ID: " + id));
        return mapToResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with ID: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPhone(request.getPhone());
        employee.setDateOfJoining(request.getDateOfJoining());
        employee.setDepartment(department);
        employee.setDesignation(request.getDesignation());
        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }

        Employee updated = employeeRepository.save(employee);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with ID: " + id));
        employee.setStatus(EmployeeStatus.INACTIVE);
        employeeRepository.save(employee);
    }

    @Override
    public EmployeeResponse getEmployeeByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee record not found for user ID: " + userId));
        return mapToResponse(employee);
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .fullName(employee.getFirstName() + " " + employee.getLastName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .dateOfJoining(employee.getDateOfJoining())
                .departmentId(employee.getDepartment().getId())
                .departmentName(employee.getDepartment().getName())
                .designation(employee.getDesignation())
                .status(employee.getStatus())
                .userId(employee.getUser() != null ? employee.getUser().getId() : null)
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}
