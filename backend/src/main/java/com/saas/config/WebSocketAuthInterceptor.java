package com.saas.config;

import com.saas.repository.TenantRepository;
import com.saas.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;

import jakarta.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.Collections;
import java.util.Map;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor, ChannelInterceptor {

    private static final Logger log = LoggerFactory.getLogger(WebSocketAuthInterceptor.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TenantRepository tenantRepository;

    // ================= HANDSHAKE (SockJS / HTTP) =================
    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest http = servletRequest.getServletRequest();

            String token = http.getParameter("token");
            if (token == null) {
                String auth = http.getHeader("Authorization");
                if (auth != null && auth.startsWith("Bearer ")) {
                    token = auth.substring(7);
                }
            }

            if (token == null) {
                log.warn("❌ WebSocket handshake rejected (no token)");
                return false;
            }

            try {
                String email = jwtUtil.extractUsername(token);
                jwtUtil.validateToken(token, email);

                Long tenantId = jwtUtil.getTenantIdFromToken(token);
                Long userId = jwtUtil.getUserIdFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);

                var tenant = tenantRepository.findById(tenantId)
                        .orElseThrow(() -> new RuntimeException("Tenant not found"));

                TenantContext.setCurrentTenant(tenant.getSchema());

                attributes.put("tenantId", tenantId);
                attributes.put("userId", userId);
                attributes.put("email", email);
                attributes.put("role", role);

                log.info("✅ WS HANDSHAKE OK user={} tenant={}", email, tenantId);
                return true;

            } catch (Exception e) {
                log.error("❌ WS HANDSHAKE JWT FAILED", e);
                return false;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        TenantContext.clear();
    }

    // ================= STOMP CONNECT =================
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (token == null) return message;

            try {
                String email = jwtUtil.extractUsername(token);
                jwtUtil.validateToken(token, email);

                Long tenantId = jwtUtil.getTenantIdFromToken(token);
                Long userId = jwtUtil.getUserIdFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);

                var tenant = tenantRepository.findById(tenantId)
                        .orElseThrow(() -> new RuntimeException("Tenant not found"));

                TenantContext.setCurrentTenant(tenant.getSchema());

                Principal principal =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(
                                        new SimpleGrantedAuthority("ROLE_" + role)
                                )
                        );

                accessor.setUser(principal);
                accessor.getSessionAttributes().put("tenantId", tenantId);
                accessor.getSessionAttributes().put("userId", userId);
                accessor.getSessionAttributes().put("email", email);

                log.info("✅ STOMP CONNECT user={} tenant={}", email, tenantId);

            } catch (Exception e) {
                log.error("❌ STOMP JWT FAILED", e);
            }
        }

        return message;
    }

    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
        TenantContext.clear();
    }
}
