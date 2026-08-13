package com.example.hrm;

import com.example.hrm.entity.SalaryStructure;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class SalaryCalculationTest {

    @Test
    @DisplayName("Should correctly calculate Gross and Net Salary using BigDecimal")
    void testSalaryCalculation() {
        SalaryStructure structure = SalaryStructure.builder()
                .name("Test Structure")
                .basicSalary(new BigDecimal("20000.00"))
                .hra(new BigDecimal("8000.00"))
                .specialAllowance(new BigDecimal("7000.00"))
                .pf(new BigDecimal("2400.00"))
                .esi(new BigDecimal("0.00"))
                .professionalTax(new BigDecimal("200.00"))
                .build();

        structure.calculateTotals();

        assertEquals(new BigDecimal("35000.00"), structure.getGrossSalary());
        assertEquals(new BigDecimal("32400.00"), structure.getNetSalary());
    }
}
