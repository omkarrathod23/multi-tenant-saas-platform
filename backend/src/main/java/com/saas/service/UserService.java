package com.saas.service;

import com.saas.config.TenantContext;
import com.saas.dto.UserRequest;
import com.saas.dto.UserResponse;
import com.saas.entity.Role;
import com.saas.entity.User;
import com.saas.repository.TenantRepository;
import com.saas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for user management operations
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get all users for current tenant
     */
    public List<UserResponse> getAllUsers(Long tenantId) {
        return userRepository.findAll().stream()
                .filter(user -> user.getTenantId().equals(tenantId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID
     */
    public UserResponse getUserById(Long id, Long tenantId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        if (!user.getTenantId().equals(tenantId)) {
            throw new RuntimeException("User does not belong to this tenant");
        }
        
        return mapToResponse(user);
    }

    /**
     * Create a new user
     */
    @Transactional
    public UserResponse createUser(UserRequest request, Long tenantId) {
        // Validate tenant exists
        var tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email '" + request.getEmail() + "' already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        user.setTenantId(tenantId);
        user.setActive(true);

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    /**
     * Update user
     */
    @Transactional
    public UserResponse updateUser(Long id, UserRequest request, Long tenantId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (!user.getTenantId().equals(tenantId)) {
            throw new RuntimeException("User does not belong to this tenant");
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("User with email '" + request.getEmail() + "' already exists");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    /**
     * Delete user (soft delete)
     */
    @Transactional
    public void deleteUser(Long id, Long tenantId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (!user.getTenantId().equals(tenantId)) {
            throw new RuntimeException("User does not belong to this tenant");
        }

        user.setActive(false);
        userRepository.save(user);
    }

    /**
     * Map User entity to UserResponse DTO
     */
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getTenantId(),
                user.getActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}

