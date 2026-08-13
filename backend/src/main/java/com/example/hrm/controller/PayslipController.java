package com.example.hrm.controller;

import com.example.hrm.service.PayslipPdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;

@RestController
@RequestMapping("/api/payslips")
@RequiredArgsConstructor
@Tag(name = "Payslip PDF", description = "APIs for downloading PDF Payslips")
public class PayslipController {

    private final PayslipPdfService payslipPdfService;

    @GetMapping("/{id}/download")
    @Operation(summary = "Download Payslip PDF", description = "Streams the PDF payslip file for download")
    public ResponseEntity<InputStreamResource> downloadPayslip(@PathVariable Long id) {
        InputStream stream = payslipPdfService.getPayslipPdfStream(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=payslip_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }
}
