package com.example.hrm.service.impl;

import com.example.hrm.dto.auth.LoginRequest;
import com.example.hrm.dto.auth.LoginResponse;
import com.example.hrm.entity.Employee;
import com.example.hrm.entity.User;
import com.example.hrm.repository.EmployeeRepository;
import com.example.hrm.repository.UserRepository;
import com.example.hrm.security.JwtUtils;
import com.example.hrm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Employee> employeeOpt = employeeRepository.findByUserId(user.getId());
        Long employeeId = employeeOpt.map(Employee::getId).orElse(null);

        return LoginResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .employeeId(employeeId)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
