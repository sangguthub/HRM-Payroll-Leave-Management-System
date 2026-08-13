package com.example.hrm.service;

import com.example.hrm.dto.dashboard.EmployeeDashboardDto;
import com.example.hrm.dto.dashboard.HrDashboardDto;

public interface DashboardService {
    HrDashboardDto getHrDashboardData();
    EmployeeDashboardDto getEmployeeDashboardData(Long userId);
}
