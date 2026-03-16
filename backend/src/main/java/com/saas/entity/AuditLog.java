package com.saas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Audit log entity for tracking user activities across the SaaS platform.
 * Supports multi-tenant isolation and comprehensive activity tracking.
 */
@Entity
@Table(name = "audit_logs", schema = "master", indexes = {
        @Index(name = "idx_tenant_id", columnList = "tenant_id"),
        @Index(name = "idx_user_email", columnList = "user_email"),
        @Index(name = "idx_action_type", columnList = "action_type"),
        @Index(name = "idx_created_at", columnList = "created_at"),
        @Index(name = "idx_entity_id", columnList = "entity_id"),
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Multi-tenant isolation
    @Column(nullable = false)
    private String tenantId;

    // User information
    @Column(nullable = false)
    private String userEmail;

    @Column
    private String userId;

    // Action details
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditActionType actionType;

    // Entity being audited
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditEntityType entityType;

    @Column(nullable = false)
    private String entityId;

    @Column
    private String entityName;

    // Request context
    @Column
    private String ipAddress;

    @Column
    private String userAgent;

    // Change tracking
    @Column(columnDefinition = "TEXT")
    private String oldValue;

    @Column(columnDefinition = "TEXT")
    private String newValue;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column
    private String status; // SUCCESS, FAILURE

    @Column
    private String errorMessage;

    // Timestamps
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public AuditLog() {
        this.createdAt = LocalDateTime.now();
    }

    // Factory method for easy creation
    public static AuditLog of(String tenantId, String userEmail, AuditActionType action, 
                              AuditEntityType entityType, String entityId) {
        AuditLog log = new AuditLog();
        log.setTenantId(tenantId);
        log.setUserEmail(userEmail);
        log.setActionType(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setStatus("SUCCESS");
        return log;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public AuditActionType getActionType() {
        return actionType;
    }

    public void setActionType(AuditActionType actionType) {
        this.actionType = actionType;
    }

    public AuditEntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(AuditEntityType entityType) {
        this.entityType = entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
