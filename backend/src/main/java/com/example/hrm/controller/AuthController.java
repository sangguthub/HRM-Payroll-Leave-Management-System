package com.example.hrm.controller;

import com.example.hrm.dto.auth.LoginRequest;
import com.example.hrm.dto.auth.LoginResponse;
import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User Login & JWT Authentication APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates user and returns JWT Token with Role")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
