package com.example.hrm.service;

import com.example.hrm.dto.payroll.PayrollProcessRequest;
import com.example.hrm.dto.payroll.PayrollResponseDto;

import java.util.List;

public interface PayrollService {
    List<PayrollResponseDto> processMonthlyPayroll(PayrollProcessRequest request, Long processorUserId);
    List<PayrollResponseDto> getPayrollByMonthAndYear(Integer month, Integer year);
    List<PayrollResponseDto> getEmployeePayrollHistory(Long employeeId);
    PayrollResponseDto getPayrollById(Long id);
}
