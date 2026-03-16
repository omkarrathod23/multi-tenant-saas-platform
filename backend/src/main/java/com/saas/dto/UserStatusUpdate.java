package com.saas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user online/offline status updates
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusUpdate {
    private Long userId;
    private String userEmail;
    private String status; // ONLINE, OFFLINE, AWAY
    private Long tenantId;
    private LocalDateTime timestamp;

    public UserStatusUpdate(Long userId, String userEmail, String status, Long tenantId) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.status = status;
        this.tenantId = tenantId;
        this.timestamp = LocalDateTime.now();
    }
}

