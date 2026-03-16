package com.saas.repository;

import com.saas.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Tenant repository - operates on master schema
 */
@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByName(String name);
    Optional<Tenant> findBySchema(String schema);
    boolean existsByName(String name);
    boolean existsBySchema(String schema);
}

