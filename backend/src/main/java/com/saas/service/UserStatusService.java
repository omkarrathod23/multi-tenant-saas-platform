package com.saas.service;

import com.saas.dto.UserStatusUpdate;
import com.saas.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Service for tracking online/offline user status
 */
@Service
public class UserStatusService {

    private static final Logger logger = LoggerFactory.getLogger(UserStatusService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketEventPublisher eventPublisher;

    // Track online users by tenantId -> userId -> sessionId
    private final ConcurrentMap<Long, ConcurrentMap<Long, String>> onlineUsersByTenant = new ConcurrentHashMap<>();

    /**
     * Mark user as online
     */
    public void userConnected(Long tenantId, Long userId, String sessionId) {
        onlineUsersByTenant.computeIfAbsent(tenantId, k -> new ConcurrentHashMap<>()).put(userId, sessionId);
        
        try {
            var user = userRepository.findById(userId);
            if (user.isPresent()) {
                UserStatusUpdate statusUpdate = new UserStatusUpdate(
                        userId,
                        user.get().getEmail(),
                        "ONLINE",
                        tenantId
                );
                eventPublisher.publishUserStatusUpdate(tenantId, statusUpdate);
                logger.info("User {} connected (tenant: {})", user.get().getEmail(), tenantId);
            }
        } catch (Exception e) {
            logger.error("Failed to publish user online status", e);
        }
    }

    /**
     * Mark user as offline
     */
    public void userDisconnected(Long tenantId, Long userId, String sessionId) {
        ConcurrentMap<Long, String> tenantUsers = onlineUsersByTenant.get(tenantId);
        if (tenantUsers != null) {
            // Only remove if this is the last session for this user
            String existingSession = tenantUsers.get(userId);
            if (sessionId.equals(existingSession)) {
                tenantUsers.remove(userId);
                
                try {
                    var user = userRepository.findById(userId);
                    if (user.isPresent()) {
                        UserStatusUpdate statusUpdate = new UserStatusUpdate(
                                userId,
                                user.get().getEmail(),
                                "OFFLINE",
                                tenantId
                        );
                        eventPublisher.publishUserStatusUpdate(tenantId, statusUpdate);
                        logger.info("User {} disconnected (tenant: {})", user.get().getEmail(), tenantId);
                    }
                } catch (Exception e) {
                    logger.error("Failed to publish user offline status", e);
                }

                // Clean up empty tenant map
                if (tenantUsers.isEmpty()) {
                    onlineUsersByTenant.remove(tenantId);
                }
            }
        }
    }

    /**
     * Get count of online users for a tenant
     */
    public long getOnlineUserCount(Long tenantId) {
        ConcurrentMap<Long, String> tenantUsers = onlineUsersByTenant.get(tenantId);
        return tenantUsers != null ? tenantUsers.size() : 0;
    }

    /**
     * Check if user is online
     */
    public boolean isUserOnline(Long tenantId, Long userId) {
        ConcurrentMap<Long, String> tenantUsers = onlineUsersByTenant.get(tenantId);
        return tenantUsers != null && tenantUsers.containsKey(userId);
    }
}

