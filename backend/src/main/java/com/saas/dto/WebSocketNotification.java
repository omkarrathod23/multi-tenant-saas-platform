package com.saas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for WebSocket notifications
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketNotification {
    private String type; // NOTIFICATION, ALERT, USER_ACTION, SYSTEM_ALERT
    private String title;
    private String message;
    private String severity; // INFO, WARNING, ERROR, SUCCESS
    private Long tenantId;
    private String userId;
    private String userEmail;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;

    public WebSocketNotification(String type, String title, String message, String severity) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.timestamp = LocalDateTime.now();
    }
}

