package com.example.hrm.repository;

import com.example.hrm.entity.LeavePolicy;
import com.example.hrm.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeavePolicyRepository extends JpaRepository<LeavePolicy, Long> {
    Optional<LeavePolicy> findByLeaveType(LeaveType leaveType);
    List<LeavePolicy> findByActiveTrue();
}
