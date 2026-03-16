package com.saas.service;

import com.saas.dto.DashboardMetrics;
import com.saas.dto.UserStatusUpdate;
import com.saas.dto.WebSocketNotification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for publishing real-time events via WebSocket
 */
@Service
public class WebSocketEventPublisher {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventPublisher.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Publish notification to tenant-specific channel
     */
    public void publishNotification(Long tenantId, WebSocketNotification notification) {
        try {
            notification.setTenantId(tenantId);
            String destination = "/topic/tenant/" + tenantId + "/notifications";
            messagingTemplate.convertAndSend(destination, notification);
            logger.debug("Published notification to tenant {}: {}", tenantId, notification.getTitle());
        } catch (Exception e) {
            logger.error("Failed to publish notification", e);
        }
    }

    /**
     * Publish notification to specific user
     */
    public void publishUserNotification(String userEmail, WebSocketNotification notification) {
        try {
            String destination = "/user/" + userEmail + "/queue/notifications";
            messagingTemplate.convertAndSendToUser(userEmail, "/queue/notifications", notification);
            logger.debug("Published notification to user {}: {}", userEmail, notification.getTitle());
        } catch (Exception e) {
            logger.error("Failed to publish user notification", e);
        }
    }

    /**
     * Publish dashboard metrics update to tenant
     */
    public void publishMetricsUpdate(Long tenantId, DashboardMetrics metrics) {
        try {
            metrics.setTenantId(tenantId);
            String destination = "/topic/tenant/" + tenantId + "/metrics";
            messagingTemplate.convertAndSend(destination, metrics);
            logger.debug("Published metrics update to tenant {}", tenantId);
        } catch (Exception e) {
            logger.error("Failed to publish metrics update", e);
        }
    }

    /**
     * Publish user status update to tenant
     */
    public void publishUserStatusUpdate(Long tenantId, UserStatusUpdate statusUpdate) {
        try {
            statusUpdate.setTenantId(tenantId);
            String destination = "/topic/tenant/" + tenantId + "/users/status";
            messagingTemplate.convertAndSend(destination, statusUpdate);
            logger.debug("Published user status update: {} - {}", statusUpdate.getUserEmail(), statusUpdate.getStatus());
        } catch (Exception e) {
            logger.error("Failed to publish user status update", e);
        }
    }

    /**
     * Publish system alert to tenant
     */
    public void publishSystemAlert(Long tenantId, String title, String message, String severity) {
        WebSocketNotification alert = new WebSocketNotification(
                "SYSTEM_ALERT",
                title,
                message,
                severity
        );
        publishNotification(tenantId, alert);
    }

    /**
     * Publish user action notification
     */
    public void publishUserAction(Long tenantId, String userEmail, String action, String entityType) {
        WebSocketNotification notification = new WebSocketNotification(
                "USER_ACTION",
                "User Action",
                String.format("%s performed %s on %s", userEmail, action, entityType),
                "INFO"
        );
        notification.setUserEmail(userEmail);
        publishNotification(tenantId, notification);
    }
}

