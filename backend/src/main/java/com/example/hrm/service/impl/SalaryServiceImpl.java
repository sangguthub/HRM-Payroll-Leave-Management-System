package com.example.hrm.service.impl;

import com.example.hrm.dto.salary.SalaryAssignmentRequest;
import com.example.hrm.dto.salary.SalaryStructureDto;
import com.example.hrm.entity.Employee;
import com.example.hrm.entity.EmployeeSalary;
import com.example.hrm.entity.SalaryStructure;
import com.example.hrm.exception.BadRequestException;
import com.example.hrm.exception.EmployeeNotFoundException;
import com.example.hrm.exception.ResourceNotFoundException;
import com.example.hrm.repository.EmployeeRepository;
import com.example.hrm.repository.EmployeeSalaryRepository;
import com.example.hrm.repository.SalaryStructureRepository;
import com.example.hrm.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryServiceImpl implements SalaryService {

    private final SalaryStructureRepository structureRepository;
    private final EmployeeSalaryRepository employeeSalaryRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public SalaryStructureDto createStructure(SalaryStructureDto dto) {
        if (structureRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Salary structure with name '" + dto.getName() + "' already exists");
        }

        SalaryStructure structure = SalaryStructure.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .basicSalary(dto.getBasicSalary())
                .hra(dto.getHra())
                .specialAllowance(dto.getSpecialAllowance())
                .pf(dto.getPf())
                .esi(dto.getEsi())
                .professionalTax(dto.getProfessionalTax())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        structure.calculateTotals();
        SalaryStructure saved = structureRepository.save(structure);
        return mapToDto(saved);
    }

    @Override
    public List<SalaryStructureDto> getAllStructures() {
        return structureRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SalaryStructureDto getStructureById(Long id) {
        SalaryStructure structure = structureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary structure not found with ID: " + id));
        return mapToDto(structure);
    }

    @Override
    @Transactional
    public SalaryStructureDto updateStructure(Long id, SalaryStructureDto dto) {
        SalaryStructure structure = structureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary structure not found with ID: " + id));

        structure.setName(dto.getName());
        structure.setDescription(dto.getDescription());
        structure.setBasicSalary(dto.getBasicSalary());
        structure.setHra(dto.getHra());
        structure.setSpecialAllowance(dto.getSpecialAllowance());
        structure.setPf(dto.getPf());
        structure.setEsi(dto.getEsi());
        structure.setProfessionalTax(dto.getProfessionalTax());
        if (dto.getActive() != null) structure.setActive(dto.getActive());

        structure.calculateTotals();
        SalaryStructure updated = structureRepository.save(structure);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteStructure(Long id) {
        SalaryStructure structure = structureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salary structure not found with ID: " + id));
        structure.setActive(false);
        structureRepository.save(structure);
    }

    @Override
    @Transactional
    public void assignSalaryToEmployee(SalaryAssignmentRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with ID: " + request.getEmployeeId()));

        SalaryStructure structure = structureRepository.findById(request.getSalaryStructureId())
                .orElseThrow(() -> new ResourceNotFoundException("Salary Structure not found with ID: " + request.getSalaryStructureId()));

        // Preserve Salary History: Close previous active record
        Optional<EmployeeSalary> activeSalaryOpt = employeeSalaryRepository.findByEmployeeIdAndActiveTrue(request.getEmployeeId());
        if (activeSalaryOpt.isPresent()) {
            EmployeeSalary current = activeSalaryOpt.get();
            current.setActive(false);
            current.setEffectiveTo(request.getEffectiveFrom().minusDays(1));
            employeeSalaryRepository.save(current);
        }

        // Create new active salary assignment
        EmployeeSalary newAssignment = EmployeeSalary.builder()
                .employee(employee)
                .salaryStructure(structure)
                .effectiveFrom(request.getEffectiveFrom())
                .effectiveTo(null)
                .active(true)
                .build();

        employeeSalaryRepository.save(newAssignment);
    }

    @Override
    public SalaryStructureDto getActiveSalaryForEmployee(Long employeeId) {
        EmployeeSalary es = employeeSalaryRepository.findByEmployeeIdAndActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("No active salary structure assigned to employee ID: " + employeeId));
        return mapToDto(es.getSalaryStructure());
    }

    @Override
    public List<SalaryStructureDto> getEmployeeSalaryHistory(Long employeeId) {
        return employeeSalaryRepository.findByEmployeeIdOrderByEffectiveFromDesc(employeeId).stream()
                .map(es -> mapToDto(es.getSalaryStructure()))
                .collect(Collectors.toList());
    }

    private SalaryStructureDto mapToDto(SalaryStructure s) {
        return SalaryStructureDto.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .basicSalary(s.getBasicSalary())
                .hra(s.getHra())
                .specialAllowance(s.getSpecialAllowance())
                .grossSalary(s.getGrossSalary())
                .pf(s.getPf())
                .esi(s.getEsi())
                .professionalTax(s.getProfessionalTax())
                .netSalary(s.getNetSalary())
                .active(s.getActive())
                .build();
    }
}
