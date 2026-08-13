package com.example.hrm.repository;

import com.example.hrm.entity.LeaveApplication;
import com.example.hrm.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {
    List<LeaveApplication> findByEmployeeId(Long employeeId);
    List<LeaveApplication> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);
    List<LeaveApplication> findByStatus(LeaveStatus status);

    @Query("SELECT l FROM LeaveApplication l WHERE l.employee.id = :employeeId " +
           "AND l.status = 'APPROVED' " +
           "AND l.fromDate <= :endDate AND l.toDate >= :startDate")
    List<LeaveApplication> findApprovedLeavesInPeriod(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
