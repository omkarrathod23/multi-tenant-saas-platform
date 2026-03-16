package com.saas.controller;

import com.saas.dto.ChatRequest;
import com.saas.dto.ChatResponse;
import com.saas.entity.ChatMessage;
import com.saas.repository.ChatRepository;
import com.saas.service.AIChatService;
import com.saas.config.TenantContext;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/ai/chat")
public class AIChatController {

    private static final Logger logger = LoggerFactory.getLogger(AIChatController.class);

    @Autowired
    private AIChatService aiChatService;

    @Autowired
    private ChatRepository chatRepository;

    @PostMapping
    public ChatResponse chat(
            @RequestBody ChatRequest request,
            HttpServletRequest httpRequest
    ) {

        // ✅ Resolve tenant safely
        String tenantId = TenantContext.getCurrentTenant();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userEmail = (authentication != null)
                ? authentication.getName()
                : "unknown@saas.local";

        String role = (authentication != null)
                ? authentication.getAuthorities().toString()
                : "[]";

        // Temporary dashboard data
        Map<String, Object> dashboardData = Map.of(
                "totalUsers", 120,
                "activeUsers", 80,
                "plan", "PRO"
        );

        String reply;
        try {
            reply = aiChatService.generateResponse(
                    request.getMessage(),
                    tenantId,
                    role,
                    dashboardData
            );
        } catch (Exception ex) {
            logger.error("AI chat processing failed", ex);
            reply = "Sorry, something went wrong processing your request.";
        }

        ChatMessage chat = new ChatMessage();
        chat.setTenantId(tenantId);
        chat.setUserEmail(userEmail);
        chat.setRole(role);
        chat.setQuestion(request.getMessage());
        chat.setAnswer(reply);
        chat.setCreatedAt(LocalDateTime.now());

        chatRepository.save(chat);

        return new ChatResponse(reply);
    }
}
