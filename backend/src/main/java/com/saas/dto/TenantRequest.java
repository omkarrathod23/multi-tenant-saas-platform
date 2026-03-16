package com.saas.dto;

import com.saas.entity.SubscriptionPlan;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TenantRequest {
    @NotBlank(message = "Tenant name is required")
    private String name;
    
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.FREE;
}

