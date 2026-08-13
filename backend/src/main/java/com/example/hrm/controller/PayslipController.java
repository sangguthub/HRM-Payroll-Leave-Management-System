package com.example.hrm.controller;

import com.example.hrm.entity.Employee;
import com.example.hrm.entity.Payslip;
import com.example.hrm.exception.PayslipNotFoundException;
import com.example.hrm.repository.EmployeeRepository;
import com.example.hrm.repository.PayslipRepository;
import com.example.hrm.security.UserPrincipal;
import com.example.hrm.service.PayslipPdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;

@RestController
@RequestMapping("/api/payslips")
@RequiredArgsConstructor
@Tag(name = "Payslip PDF", description = "APIs for downloading PDF Payslips")
public class PayslipController {

    private final PayslipPdfService payslipPdfService;
    private final PayslipRepository payslipRepository;
    private final EmployeeRepository employeeRepository;

    @GetMapping("/{id}/download")
    @Operation(summary = "Download Payslip PDF", description = "Streams the PDF payslip file for download with ownership authorization check")
    public ResponseEntity<InputStreamResource> downloadPayslip(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        Payslip payslip = payslipRepository.findById(id)
                .orElseThrow(() -> new PayslipNotFoundException("Payslip not found with ID: " + id));

        // Enforce Security Rule: Employees can ONLY access their own payslip unless HR/Admin
        boolean isHrOrAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_HR") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isHrOrAdmin) {
            Employee loggedInEmployee = employeeRepository.findByUserId(principal.getId()).orElse(null);
            if (loggedInEmployee == null || !loggedInEmployee.getId().equals(payslip.getEmployee().getId())) {
                throw new org.springframework.security.access.AccessDeniedException("Unauthorized: You can only download your own payslips");
            }
        }

        InputStream stream = payslipPdfService.getPayslipPdfStream(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=payslip_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }
}
