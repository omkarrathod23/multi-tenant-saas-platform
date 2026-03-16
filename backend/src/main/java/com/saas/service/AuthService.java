package com.saas.service;

import com.saas.config.TenantContext;
import com.saas.dto.AuthResponse;
import com.saas.dto.LoginRequest;
import com.saas.dto.RegisterRequest;
import com.saas.entity.Role;
import com.saas.entity.User;
import com.saas.repository.TenantRepository;
import com.saas.repository.UserRepository;
import com.saas.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication service for login and registration
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Register a new user
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate tenant exists
        Long tenantId = Long.parseLong(request.getTenantId());
        var tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        if (!tenant.getActive()) {
            throw new RuntimeException("Tenant is not active");
        }

        // Set tenant context to switch to tenant's schema
        TenantContext.setCurrentTenant(tenant.getSchema());

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email '" + request.getEmail() + "' already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.USER);
        user.setTenantId(tenantId);
        user.setActive(true);

        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), 
                                            user.getRole().name(), user.getTenantId());

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                user.getTenantId()
        );
    }

    /**
     * Login user
     */
    public AuthResponse login(LoginRequest request) {
        // Validate tenant exists
        Long tenantId;
        try {
            tenantId = Long.parseLong(request.getTenantId());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid Tenant ID format: " + request.getTenantId());
        }

        var tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant with ID " + tenantId + " not found. Please verify the Tenant ID."));

        if (!tenant.getActive()) {
            throw new RuntimeException("Tenant '" + tenant.getName() + "' is not active.");
        }

        // Set tenant context to switch to tenant's schema
        System.out.println("🔐 Login attempt for: " + request.getEmail() + " on tenant: " + tenantId + " (Schema: " + tenant.getSchema() + ")");
        TenantContext.setCurrentTenant(tenant.getSchema());

        // Find user
        User user = userRepository.findByEmailAndTenantId(request.getEmail(), tenantId)
                .orElseThrow(() -> {
                    System.err.println("❌ User not found: " + request.getEmail() + " in tenant " + tenantId);
                    return new RuntimeException("User with email '" + request.getEmail() + "' not found in tenant " + tenantId);
                });

        if (!user.getActive()) {
            System.err.println("❌ User inactive: " + request.getEmail());
            throw new RuntimeException("User account for '" + request.getEmail() + "' is inactive.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.err.println("❌ Password mismatch for: " + request.getEmail());
            throw new RuntimeException("Incorrect password for '" + request.getEmail() + "'.");
        }

        System.out.println("✅ Login successful for: " + request.getEmail());

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), 
                                            user.getRole().name(), user.getTenantId());

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                user.getTenantId()
        );
    }
}

