package com.saas.controller;

import com.saas.dto.ApiResponse;
import com.saas.dto.UserRequest;
import com.saas.dto.UserResponse;
import com.saas.service.UserService;
import com.saas.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User management controller
 * Accessible by TENANT_ADMIN, SUPER_ADMIN, and USER (for own profile)
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getTenantIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.getTenantIdFromToken(token);
        }
        throw new RuntimeException("No authentication token found");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(HttpServletRequest request) {
        try {
            Long tenantId = getTenantIdFromToken(request);
            List<UserResponse> users = userService.getAllUsers(tenantId);
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id, 
            HttpServletRequest request) {
        try {
            Long tenantId = getTenantIdFromToken(request);
            UserResponse user = userService.getUserById(id, tenantId);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long tenantId = getTenantIdFromToken(httpRequest);
            UserResponse user = userService.createUser(request, tenantId);
            return ResponseEntity.ok(ApiResponse.success("User created successfully", user));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long tenantId = getTenantIdFromToken(httpRequest);
            UserResponse user = userService.updateUser(id, request, tenantId);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", user));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            HttpServletRequest request) {
        try {
            Long tenantId = getTenantIdFromToken(request);
            userService.deleteUser(id, tenantId);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}

