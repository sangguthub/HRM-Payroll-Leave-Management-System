package com.example.hrm.repository;

import com.example.hrm.entity.Payroll;
import com.example.hrm.enums.PayrollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    Optional<Payroll> findByEmployeeIdAndPayPeriodMonthAndPayPeriodYear(Long employeeId, Integer month, Integer year);
    Boolean existsByEmployeeIdAndPayPeriodMonthAndPayPeriodYear(Long employeeId, Integer month, Integer year);
    List<Payroll> findByPayPeriodMonthAndPayPeriodYear(Integer month, Integer year);
    List<Payroll> findByEmployeeIdOrderByPayPeriodYearDescPayPeriodMonthDesc(Long employeeId);
    List<Payroll> findByStatus(PayrollStatus status);
}
