package com.saas.dto;

import com.saas.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Long tenantId;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

