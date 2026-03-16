package com.saas.dto;

import com.saas.entity.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponse {
    private Long id;
    private String name;
    private String schema;
    private SubscriptionPlan subscriptionPlan;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

