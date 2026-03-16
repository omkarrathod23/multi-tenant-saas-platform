package com.saas.config;

import org.hibernate.cfg.AvailableSettings;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Hibernate resolver to get current tenant identifier from TenantContext
 */
@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver, 
                                                  HibernatePropertiesCustomizer {

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenant = TenantContext.getCurrentTenant();
        // Default to 'master' schema if no tenant is set (for global operations)
        String resolved = tenant != null ? tenant : "master";
        System.out.println("🔍 Hibernate resolving tenant identifier: " + resolved);
        return resolved;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }

    @Override
    public void customize(Map<String, Object> hibernateProperties) {
        hibernateProperties.put(AvailableSettings.MULTI_TENANT_IDENTIFIER_RESOLVER, this);
    }
}

