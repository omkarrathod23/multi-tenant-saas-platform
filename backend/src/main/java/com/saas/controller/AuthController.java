package com.saas.controller;

import com.saas.dto.ApiResponse;
import com.saas.dto.AuthResponse;
import com.saas.dto.LoginRequest;
import com.saas.dto.RegisterRequest;
import com.saas.service.AuthService;
import com.saas.service.AuditLogService;
import com.saas.entity.AuditActionType;
import com.saas.entity.AuditEntityType;
import com.saas.config.TenantContext;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller for login and registration
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            
            // Log registration event
            TenantContext.setCurrentTenant("master");
            auditLogService.logActivity(
                AuditActionType.CREATE,
                AuditEntityType.USER,
                response.getId().toString(),
                response.getEmail(),
                "User registered: " + response.getEmail()
            );
            
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
        } catch (Exception e) {
            // Log failed registration
            try {
                TenantContext.setCurrentTenant("master");
                auditLogService.logFailure(
                    AuditActionType.CREATE,
                    AuditEntityType.USER,
                    "unknown",
                    e.getMessage()
                );
            } catch (Exception ex) {
                // Silently fail audit logging
            }
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            
            // Log login event
            TenantContext.setCurrentTenant(String.valueOf(response.getTenantId()));
            auditLogService.logActivity(
                AuditActionType.LOGIN,
                AuditEntityType.USER,
                response.getId().toString(),
                response.getEmail(),
                "User logged in"
            );
            
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            e.printStackTrace();
            // Log failed login
            try {
                TenantContext.setCurrentTenant("master");
                auditLogService.logFailure(
                    AuditActionType.LOGIN,
                    AuditEntityType.USER,
                    "unknown",
                    "Failed login attempt for: " + request.getEmail()
                );
            } catch (Exception ex) {
                // Silently fail audit logging
            }
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}

