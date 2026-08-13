package com.example.hrm.entity;

import com.example.hrm.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeavePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false, unique = true)
    private LeaveType leaveType;

    @Column(name = "annual_allocation", nullable = false)
    private Integer annualAllocation;

    private String description;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
