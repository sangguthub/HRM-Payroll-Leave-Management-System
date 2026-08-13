package com.example.hrm.exception;

public class PayrollAlreadyProcessedException extends RuntimeException {
    public PayrollAlreadyProcessedException(String message) {
        super(message);
    }
}
