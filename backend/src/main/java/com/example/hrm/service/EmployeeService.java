package com.example.hrm.service;

import com.example.hrm.dto.employee.EmployeeRequest;
import com.example.hrm.dto.employee.EmployeeResponse;
import java.util.List;

public interface EmployeeService {
    EmployeeResponse createEmployee(EmployeeRequest request);
    List<EmployeeResponse> getAllEmployees();
    EmployeeResponse getEmployeeById(Long id);
    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);
    void deleteEmployee(Long id);
    EmployeeResponse getEmployeeByUserId(Long userId);
}
