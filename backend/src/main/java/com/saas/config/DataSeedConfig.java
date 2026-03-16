package com.saas.config;

import com.saas.entity.Role;
import com.saas.entity.SubscriptionPlan;
import com.saas.entity.Tenant;
import com.saas.entity.User;
import com.saas.repository.TenantRepository;
import com.saas.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

/**
 * Configuration to seed initial data if the database is empty.
 * This ensures the application is ready for use, especially in development.
 */
@Configuration
public class DataSeedConfig {

    @Bean
    public CommandLineRunner initData(
            TenantRepository tenantRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {
        return args -> {
            System.out.println("🚀 Starting data seeding process...");

            try {
                // 0. Ensure Master Schema and Tenants Table Exist
                // This is critical for the master repository to function on a fresh DB
                jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS master");
                System.out.println("✅ Master schema verified/created.");

                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS master.tenants (" +
                        "id BIGSERIAL PRIMARY KEY, " +
                        "name VARCHAR(255) NOT NULL, " +
                        "schema_name VARCHAR(255) NOT NULL UNIQUE, " +
                        "subscription_plan VARCHAR(50) NOT NULL, " +
                        "active BOOLEAN NOT NULL DEFAULT true, " +
                        "created_at TIMESTAMP NOT NULL, " +
                        "updated_at TIMESTAMP)");
                System.out.println("✅ Table 'master.tenants' verified/created.");

                // 1. Ensure Default Tenant Exists in Master Schema
                Tenant tenant = tenantRepository.findBySchema("test_tenant").orElse(null);
                if (tenant == null) {
                    tenant = new Tenant();
                    tenant.setName("Test Tenant");
                    tenant.setSchema("test_tenant");
                    tenant.setSubscriptionPlan(SubscriptionPlan.PRO);
                    tenant.setActive(true);
                    tenant.setCreatedAt(LocalDateTime.now());
                    tenant = tenantRepository.save(tenant);
                    System.out.println("✅ Default tenant created with ID: " + tenant.getId());
                } else {
                    System.out.println("ℹ️ Default tenant already exists with ID: " + tenant.getId());
                }
            
            // 2. Ensure the tenant schema exists in PostgreSQL
            jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + tenant.getSchema());
            System.out.println("✅ Schema '" + tenant.getSchema() + "' verified/created.");

            // 3. Manually create users table if it doesn't exist
            String createTableSql = "CREATE TABLE IF NOT EXISTS " + tenant.getSchema() + ".users (" +
                    "id BIGSERIAL PRIMARY KEY, " +
                    "email VARCHAR(255) NOT NULL UNIQUE, " +
                    "password VARCHAR(255) NOT NULL, " +
                    "first_name VARCHAR(255) NOT NULL, " +
                    "last_name VARCHAR(255) NOT NULL, " +
                    "role VARCHAR(50) NOT NULL, " +
                    "tenant_id BIGINT NOT NULL, " +
                    "active BOOLEAN NOT NULL DEFAULT true, " +
                    "created_at TIMESTAMP NOT NULL, " +
                    "updated_at TIMESTAMP)";
            jdbcTemplate.execute(createTableSql);
            System.out.println("✅ Table '" + tenant.getSchema() + ".users' verified/created.");

            // 4. Ensure Default Super Admin Exists in that tenant
            TenantContext.setCurrentTenant(tenant.getSchema());
            
            try {
                if (!userRepository.existsByEmail("admin@test.com")) {
                    User admin = new User();
                    admin.setEmail("admin@test.com");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setFirstName("Super");
                    admin.setLastName("Admin");
                    admin.setRole(Role.SUPER_ADMIN);
                    admin.setTenantId(tenant.getId());
                    admin.setActive(true);
                    admin.setCreatedAt(LocalDateTime.now());
                    userRepository.save(admin);
                    System.out.println("✅ Default SUPER_ADMIN seeded successfully.");
                } else {
                    System.out.println("ℹ️ Default SUPER_ADMIN already exists.");
                }

                // 2. Ensure Default Tenant Admin Exists
                if (!userRepository.existsByEmail("tenant@test.com")) {
                    User tenantAdmin = new User();
                    tenantAdmin.setEmail("tenant@test.com");
                    tenantAdmin.setPassword(passwordEncoder.encode("admin123"));
                    tenantAdmin.setFirstName("Tenant");
                    tenantAdmin.setLastName("Admin");
                    tenantAdmin.setRole(Role.TENANT_ADMIN);
                    tenantAdmin.setTenantId(tenant.getId());
                    tenantAdmin.setActive(true);
                    tenantAdmin.setCreatedAt(LocalDateTime.now());
                    userRepository.save(tenantAdmin);
                    System.out.println("✅ Default TENANT_ADMIN seeded successfully.");
                }

                // 3. Ensure Default Regular User Exists
                if (!userRepository.existsByEmail("user@test.com")) {
                    User regularUser = new User();
                    regularUser.setEmail("user@test.com");
                    regularUser.setPassword(passwordEncoder.encode("user123"));
                    regularUser.setFirstName("Regular");
                    regularUser.setLastName("User");
                    regularUser.setRole(Role.USER);
                    regularUser.setTenantId(tenant.getId());
                    regularUser.setActive(true);
                    regularUser.setCreatedAt(LocalDateTime.now());
                    userRepository.save(regularUser);
                    System.out.println("✅ Default USER seeded successfully.");
                }
            } catch (Exception e) {
                System.err.println("❌ Failed to seed SUPER_ADMIN: " + e.getMessage());
            } finally {
                TenantContext.clear();
            }
            
            System.out.println("🏁 Data seeding process finished.");
        };
    }
}
