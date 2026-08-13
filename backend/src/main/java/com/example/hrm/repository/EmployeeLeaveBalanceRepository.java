package com.example.hrm.repository;

import com.example.hrm.entity.EmployeeLeaveBalance;
import com.example.hrm.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeLeaveBalanceRepository extends JpaRepository<EmployeeLeaveBalance, Long> {
    List<EmployeeLeaveBalance> findByEmployeeIdAndYear(Long employeeId, Integer year);
    Optional<EmployeeLeaveBalance> findByEmployeeIdAndLeaveTypeAndYear(Long employeeId, LeaveType leaveType, Integer year);
    List<EmployeeLeaveBalance> findByYear(Integer year);
}
