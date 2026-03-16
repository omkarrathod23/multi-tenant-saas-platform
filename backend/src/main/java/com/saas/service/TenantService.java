package com.saas.service;

import com.saas.config.TenantContext;
import com.saas.dto.TenantRequest;
import com.saas.dto.TenantResponse;
import com.saas.entity.Tenant;
import com.saas.entity.SubscriptionPlan;
import com.saas.repository.TenantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for tenant management operations
 * Only SUPER_ADMIN can manage tenants
 */
@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${app.default-tenant-schema:master}")
    private String defaultSchema;

    /**
     * Create a new tenant and its database schema
     */
    @Transactional
    public TenantResponse createTenant(TenantRequest request) {
        // Check if tenant name already exists
        if (tenantRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tenant with name '" + request.getName() + "' already exists");
        }

        // Generate schema name from tenant name (sanitized)
        String schemaName = generateSchemaName(request.getName());
        
        if (tenantRepository.existsBySchema(schemaName)) {
            throw new RuntimeException("Schema '" + schemaName + "' already exists");
        }

        // Create tenant entity
        Tenant tenant = new Tenant();
        tenant.setName(request.getName());
        tenant.setSchema(schemaName);
        tenant.setSubscriptionPlan(request.getSubscriptionPlan() != null ? 
                                   request.getSubscriptionPlan() : SubscriptionPlan.FREE);
        tenant.setActive(true);

        // Save tenant in master schema
        tenant = tenantRepository.save(tenant);

        // Create database schema for the tenant
        createTenantSchema(schemaName);

        return mapToResponse(tenant);
    }

    /**
     * Get all tenants (only for SUPER_ADMIN)
     */
    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get tenant by ID
     */
    public TenantResponse getTenantById(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + id));
        return mapToResponse(tenant);
    }

    /**
     * Update tenant
     */
    @Transactional
    public TenantResponse updateTenant(Long id, TenantRequest request) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + id));

        if (request.getName() != null && !request.getName().equals(tenant.getName())) {
            if (tenantRepository.existsByName(request.getName())) {
                throw new RuntimeException("Tenant with name '" + request.getName() + "' already exists");
            }
            tenant.setName(request.getName());
        }

        if (request.getSubscriptionPlan() != null) {
            tenant.setSubscriptionPlan(request.getSubscriptionPlan());
        }

        tenant = tenantRepository.save(tenant);
        return mapToResponse(tenant);
    }

    /**
     * Delete tenant (soft delete by setting active to false)
     */
    @Transactional
    public void deleteTenant(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + id));
        tenant.setActive(false);
        tenantRepository.save(tenant);
    }

    /**
     * Create database schema for tenant
     */
    private void createTenantSchema(String schemaName) {
        try {
            // Switch to master schema context
            String currentSchema = TenantContext.getCurrentTenant();
            TenantContext.setCurrentTenant("master");

            // Create schema
            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + schemaName);

            // Create users table in the new schema
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS " + schemaName + ".users (" +
                    "id BIGSERIAL PRIMARY KEY, " +
                    "email VARCHAR(255) NOT NULL UNIQUE, " +
                    "password VARCHAR(255) NOT NULL, " +
                    "first_name VARCHAR(255) NOT NULL, " +
                    "last_name VARCHAR(255) NOT NULL, " +
                    "role VARCHAR(50) NOT NULL, " +
                    "tenant_id BIGINT NOT NULL, " +
                    "active BOOLEAN NOT NULL DEFAULT true, " +
                    "created_at TIMESTAMP NOT NULL, " +
                    "updated_at TIMESTAMP" +
                    ")");

            // Restore previous schema context
            TenantContext.setCurrentTenant(currentSchema);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create tenant schema: " + e.getMessage(), e);
        }
    }

    /**
     * Generate schema name from tenant name
     */
    private String generateSchemaName(String tenantName) {
        return tenantName.toLowerCase()
                .replaceAll("[^a-z0-9]", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");
    }

    /**
     * Map Tenant entity to TenantResponse DTO
     */
    private TenantResponse mapToResponse(Tenant tenant) {
        return new TenantResponse(
                tenant.getId(),
                tenant.getName(),
                tenant.getSchema(),
                tenant.getSubscriptionPlan(),
                tenant.getActive(),
                tenant.getCreatedAt(),
                tenant.getUpdatedAt()
        );
    }
}

