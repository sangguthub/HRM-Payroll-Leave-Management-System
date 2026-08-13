package com.example.hrm.dto.auth;

import com.example.hrm.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private Long employeeId;
    private String name;
    private String email;
    private Role role;
}
