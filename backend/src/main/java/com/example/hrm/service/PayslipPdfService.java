package com.example.hrm.service;

import com.example.hrm.entity.Payroll;
import com.example.hrm.entity.Payslip;

import java.io.InputStream;

public interface PayslipPdfService {
    Payslip generateAndSavePayslipPdf(Payroll payroll);
    InputStream getPayslipPdfStream(Long payslipId);
}
