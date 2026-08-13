package com.example.hrm.service;

import java.io.ByteArrayInputStream;

public interface ExportService {
    ByteArrayInputStream exportMonthlyPayrollToExcel(Integer month, Integer year);
    ByteArrayInputStream exportMonthlyPayslipsToZip(Integer month, Integer year);
}
