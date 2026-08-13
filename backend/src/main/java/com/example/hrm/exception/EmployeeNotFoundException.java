package com.example.hrm.exception;

public class EmployeeNotFoundException extends ResourceNotFoundException {
    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
