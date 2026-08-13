package com.example.hrm.repository;

import com.example.hrm.entity.EmployeeSalary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeSalaryRepository extends JpaRepository<EmployeeSalary, Long> {
    List<EmployeeSalary> findByEmployeeIdOrderByEffectiveFromDesc(Long employeeId);
    Optional<EmployeeSalary> findByEmployeeIdAndActiveTrue(Long employeeId);

    @Query("SELECT es FROM EmployeeSalary es WHERE es.employee.id = :employeeId " +
           "AND es.effectiveFrom <= :targetDate " +
           "AND (es.effectiveTo IS NULL OR es.effectiveTo >= :targetDate) " +
           "ORDER BY es.effectiveFrom DESC")
    List<EmployeeSalary> findEffectiveSalaryAtDate(@Param("employeeId") Long employeeId, @Param("targetDate") LocalDate targetDate);
}
