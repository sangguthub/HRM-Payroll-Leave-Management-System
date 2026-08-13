package com.example.hrm.exception;

public class PayslipNotFoundException extends ResourceNotFoundException {
    public PayslipNotFoundException(String message) {
        super(message);
    }
}
