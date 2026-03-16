package com.saas.service;

import com.saas.config.TenantContext;
import com.saas.entity.AuditLog;
import com.saas.entity.AuditActionType;
import com.saas.entity.AuditEntityType;
import com.saas.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for audit logging across the SaaS platform.
 * Handles recording of user activities with full context (IP, User Agent, etc.)
 */
@Service
public class AuditLogService {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogService.class);

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Record a user activity
     */
    @Transactional
    public AuditLog logActivity(AuditActionType actionType, AuditEntityType entityType, 
                               String entityId, String entityName, String details) {
        try {
            String tenantId = TenantContext.getCurrentTenant();
            String userEmail = getCurrentUserEmail();
            
            AuditLog log = AuditLog.of(tenantId, userEmail, actionType, entityType, entityId);
            log.setEntityName(entityName);
            log.setDetails(details);
            log.setIpAddress(getClientIpAddress());
            log.setUserAgent(getUserAgent());
            
            return auditLogRepository.save(log);
        } catch (Exception e) {
            logger.error("Error logging activity", e);
            return null;
        }
    }

    /**
     * Record a successful action with old and new values
     */
    @Transactional
    public AuditLog logChange(AuditActionType actionType, AuditEntityType entityType,
                             String entityId, String entityName, String oldValue, String newValue) {
        try {
            String tenantId = TenantContext.getCurrentTenant();
            String userEmail = getCurrentUserEmail();
            
            AuditLog log = AuditLog.of(tenantId, userEmail, actionType, entityType, entityId);
            log.setEntityName(entityName);
            log.setOldValue(oldValue);
            log.setNewValue(newValue);
            log.setIpAddress(getClientIpAddress());
            log.setUserAgent(getUserAgent());
            
            return auditLogRepository.save(log);
        } catch (Exception e) {
            logger.error("Error logging change", e);
            return null;
        }
    }

    /**
     * Record a failed operation
     */
    @Transactional
    public AuditLog logFailure(AuditActionType actionType, AuditEntityType entityType,
                              String entityId, String errorMessage) {
        try {
            String tenantId = TenantContext.getCurrentTenant();
            String userEmail = getCurrentUserEmail();
            
            AuditLog log = AuditLog.of(tenantId, userEmail, actionType, entityType, entityId);
            log.setStatus("FAILURE");
            log.setErrorMessage(errorMessage);
            log.setIpAddress(getClientIpAddress());
            log.setUserAgent(getUserAgent());
            
            return auditLogRepository.save(log);
        } catch (Exception e) {
            logger.error("Error logging failure", e);
            return null;
        }
    }

    /**
     * Fetch paginated audit logs for a tenant
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByTenant(String tenantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findByTenantId(tenantId, pageable);
    }

    /**
     * Fetch audit logs for a specific user
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByUser(String tenantId, String userEmail, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findByTenantIdAndUserEmail(tenantId, userEmail, pageable);
    }

    /**
     * Fetch audit logs by action type
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByActionType(String tenantId, AuditActionType actionType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findByTenantIdAndActionType(tenantId, actionType, pageable);
    }

    /**
     * Fetch audit logs within a date range
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByDateRange(String tenantId, LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findByTenantIdAndDateRange(tenantId, startDate, endDate, pageable);
    }

    /**
     * Fetch audit logs for a user within a date range
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByUserAndDateRange(String tenantId, String userEmail, 
                                                        LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findByTenantIdUserEmailAndDateRange(tenantId, userEmail, startDate, endDate, pageable);
    }

    /**
     * Get all activities for a specific entity
     */
    @Transactional(readOnly = true)
    public List<AuditLog> getEntityHistory(String tenantId, String entityId) {
        return auditLogRepository.findByTenantIdAndEntityId(tenantId, entityId);
    }

    /**
     * Get recent activities for current user
     */
    @Transactional(readOnly = true)
    public List<AuditLog> getMyRecentActivities(String tenantId, String userEmail) {
        return auditLogRepository.findRecentActivitiesByUserEmail(tenantId, userEmail);
    }

    /**
     * Get failed operations for tenant
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getFailedOperations(String tenantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findFailedLogsByTenantId(tenantId, pageable);
    }

    /**
     * Helper: Get current user email from SecurityContext
     */
    private String getCurrentUserEmail() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null && authentication.getName() != null) 
            ? authentication.getName() : "system";
    }

    /**
     * Helper: Extract client IP address from HTTP request
     */
    private String getClientIpAddress() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String clientIp = request.getHeader("X-Forwarded-For");
                if (clientIp == null || clientIp.isEmpty()) {
                    clientIp = request.getRemoteAddr();
                }
                return clientIp;
            }
        } catch (Exception e) {
            logger.debug("Could not extract client IP", e);
        }
        return "unknown";
    }

    /**
     * Helper: Extract User-Agent from HTTP request
     */
    private String getUserAgent() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                return attrs.getRequest().getHeader("User-Agent");
            }
        } catch (Exception e) {
            logger.debug("Could not extract User-Agent", e);
        }
        return "unknown";
    }
}
