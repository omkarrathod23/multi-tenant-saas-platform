package com.saas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for real-time dashboard metrics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetrics {
    private Long tenantId;
    private Long totalUsers;
    private Long activeUsers;
    private Long onlineUsers;
    private Double growthRate;
    private Double performance;
    private LocalDateTime timestamp;

    public DashboardMetrics(Long tenantId, Long totalUsers, Long activeUsers, Long onlineUsers) {
        this.tenantId = tenantId;
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.onlineUsers = onlineUsers;
        this.timestamp = LocalDateTime.now();
    }
}

