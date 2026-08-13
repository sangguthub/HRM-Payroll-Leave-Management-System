package com.example.hrm.service;

import com.example.hrm.dto.salary.SalaryAssignmentRequest;
import com.example.hrm.dto.salary.SalaryStructureDto;

import java.util.List;

public interface SalaryService {
    SalaryStructureDto createStructure(SalaryStructureDto dto);
    List<SalaryStructureDto> getAllStructures();
    SalaryStructureDto getStructureById(Long id);
    SalaryStructureDto updateStructure(Long id, SalaryStructureDto dto);
    void deleteStructure(Long id);

    void assignSalaryToEmployee(SalaryAssignmentRequest request);
    SalaryStructureDto getActiveSalaryForEmployee(Long employeeId);
    List<SalaryStructureDto> getEmployeeSalaryHistory(Long employeeId);
}
