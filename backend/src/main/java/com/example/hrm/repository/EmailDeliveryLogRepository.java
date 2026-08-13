package com.example.hrm.repository;

import com.example.hrm.entity.EmailDeliveryLog;
import com.example.hrm.enums.EmailStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmailDeliveryLogRepository extends JpaRepository<EmailDeliveryLog, Long> {
    List<EmailDeliveryLog> findByStatus(EmailStatus status);
    List<EmailDeliveryLog> findByEmployeeId(Long employeeId);
    List<EmailDeliveryLog> findByStatusAndRetryCountLessThan(EmailStatus status, Integer maxRetries);
}
