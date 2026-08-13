package com.example.hrm.repository;

import com.example.hrm.entity.Employee;
import com.example.hrm.enums.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByEmail(String email);
    Boolean existsByEmployeeCode(String employeeCode);
    Boolean existsByEmail(String email);
    List<Employee> findByStatus(EmployeeStatus status);
    Optional<Employee> findByUserId(Long userId);
}
