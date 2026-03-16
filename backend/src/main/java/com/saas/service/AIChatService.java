package com.saas.service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AIChatService {

    public String generateResponse(
            String userMessage,
            String tenantId,
            String role,
            Map<String, Object> dashboardData
    ) {

        // This prompt will be sent to AI later
        String prompt = """
        You are an AI assistant for a SaaS dashboard.

        Tenant: %s
        Role: %s
        Dashboard Data: %s
        User Question: %s

        Answer in simple business language.
        """.formatted(tenantId, role, dashboardData, userMessage);

        // TEMP MOCK RESPONSE (NO AI API YET)
        return "Based on your dashboard data, user engagement is stable but active usage can be improved.";
    }
}
