package com.saas.entity;

/**
 * Enumeration of audit-able actions
 */
public enum AuditActionType {
    LOGIN("User logged in"),
    LOGOUT("User logged out"),
    CREATE("Resource created"),
    UPDATE("Resource updated"),
    DELETE("Resource deleted"),
    VIEW("Resource viewed"),
    PERMISSION_GRANT("Permission granted"),
    PERMISSION_REVOKE("Permission revoked"),
    ROLE_CHANGE("User role changed"),
    PASSWORD_CHANGE("Password changed"),
    ACCOUNT_LOCK("Account locked"),
    ACCOUNT_UNLOCK("Account unlocked"),
    EXPORT("Data exported"),
    OTHER("Other action");

    private final String description;

    AuditActionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
