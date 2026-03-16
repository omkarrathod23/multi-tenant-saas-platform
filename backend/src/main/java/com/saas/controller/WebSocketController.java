package com.saas.controller;

import com.saas.service.UserStatusService;
import com.saas.service.WebSocketEventPublisher;
import com.saas.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket controller for handling real-time subscriptions and events
 */
@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @Autowired
    private UserStatusService userStatusService;

    @Autowired
    private WebSocketEventPublisher eventPublisher;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Handle subscription to tenant notifications
     * Clients subscribe to: /app/tenant/notifications
     */
    @MessageMapping("/tenant/notifications")
    public void subscribeToNotifications(Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String email = principal.getName();
            Long tenantId = (Long) headerAccessor.getSessionAttributes().get("tenantId");
            Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
            String sessionId = headerAccessor.getSessionId();

            if (tenantId != null && userId != null) {
                userStatusService.userConnected(tenantId, userId, sessionId);
                logger.info("User {} subscribed to notifications (tenant: {})", email, tenantId);
            }
        } catch (Exception e) {
            logger.error("Error in notification subscription", e);
        }
    }

    /**
     * Handle subscription to dashboard metrics
     * Clients subscribe to: /app/tenant/metrics
     */
    @MessageMapping("/tenant/metrics")
    public void subscribeToMetrics(Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String email = principal.getName();
            Long tenantId = (Long) headerAccessor.getSessionAttributes().get("tenantId");
            logger.info("User {} subscribed to metrics (tenant: {})", email, tenantId);
        } catch (Exception e) {
            logger.error("Error in metrics subscription", e);
        }
    }

    /**
     * Handle user status subscription
     * Clients subscribe to: /app/users/status
     */
    @MessageMapping("/users/status")
    public void subscribeToUserStatus(Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String email = principal.getName();
            Long tenantId = (Long) headerAccessor.getSessionAttributes().get("tenantId");
            logger.info("User {} subscribed to user status (tenant: {})", email, tenantId);
        } catch (Exception e) {
            logger.error("Error in user status subscription", e);
        }
    }

    /**
     * Handle disconnect events
     */
    @org.springframework.context.event.EventListener
    public void handleDisconnect(org.springframework.web.socket.messaging.SessionDisconnectEvent event) {
        try {
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
            Long tenantId = (Long) headerAccessor.getSessionAttributes().get("tenantId");
            Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
            String sessionId = headerAccessor.getSessionId();

            if (tenantId != null && userId != null) {
                userStatusService.userDisconnected(tenantId, userId, sessionId);
            }
        } catch (Exception e) {
            logger.error("Error handling disconnect", e);
        }
    }

    /**
     * Handle connect events
     */
    @org.springframework.context.event.EventListener
    public void handleConnect(org.springframework.web.socket.messaging.SessionConnectEvent event) {
        try {
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
            Long tenantId = (Long) headerAccessor.getSessionAttributes().get("tenantId");
            Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
            String sessionId = headerAccessor.getSessionId();

            if (tenantId != null && userId != null) {
                userStatusService.userConnected(tenantId, userId, sessionId);
            }
        } catch (Exception e) {
            logger.error("Error handling connect", e);
        }
    }
}

