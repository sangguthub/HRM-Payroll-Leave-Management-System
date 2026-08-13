package com.example.hrm.entity;

import com.example.hrm.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee_leave_balances",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"employee_id", "leave_type", "balance_year"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType leaveType;

    @Column(name = "balance_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer allocated;

    @Column(nullable = false)
    @Builder.Default
    private Integer used = 0;

    @Column(nullable = false)
    private Integer remaining;
}
