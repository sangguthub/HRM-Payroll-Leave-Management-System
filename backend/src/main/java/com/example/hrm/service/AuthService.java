package com.example.hrm.service;

import com.example.hrm.dto.auth.LoginRequest;
import com.example.hrm.dto.auth.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
