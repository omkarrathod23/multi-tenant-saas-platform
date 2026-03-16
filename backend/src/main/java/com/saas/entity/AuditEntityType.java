package com.saas.entity;

/**
 * Enumeration of entity types that can be audited
 */
public enum AuditEntityType {
    USER("User"),
    TENANT("Tenant"),
    ROLE("Role"),
    PERMISSION("Permission"),
    CHAT_MESSAGE("Chat Message"),
    SETTING("Setting"),
    OTHER("Other");

    private final String displayName;

    AuditEntityType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
