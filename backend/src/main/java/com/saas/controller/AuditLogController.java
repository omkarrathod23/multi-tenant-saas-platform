package com.saas.controller;

import com.saas.entity.AuditLog;
import com.saas.entity.AuditActionType;
import com.saas.service.AuditLogService;
import com.saas.config.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for audit log management.
 * Only accessible to admins (TENANT_ADMIN, SUPER_ADMIN roles)
 */
@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Get all audit logs for the current tenant
     * Query params: page (0-indexed), size, action, startDate, endDate
     */
    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public Map<String, Object> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String userEmail,
            @RequestParam(required = false) AuditActionType actionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        String tenantId = TenantContext.getCurrentTenant();
        Page<AuditLog> logs;

        // Apply filters
        if (userEmail != null && startDate != null && endDate != null) {
            logs = auditLogService.getAuditLogsByUserAndDateRange(tenantId, userEmail, startDate, endDate, page, size);
        } else if (userEmail != null) {
            logs = auditLogService.getAuditLogsByUser(tenantId, userEmail, page, size);
        } else if (actionType != null) {
            logs = auditLogService.getAuditLogsByActionType(tenantId, actionType, page, size);
        } else if (startDate != null && endDate != null) {
            logs = auditLogService.getAuditLogsByDateRange(tenantId, startDate, endDate, page, size);
        } else {
            logs = auditLogService.getAuditLogsByTenant(tenantId, page, size);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("currentPage", page);
        return response;
    }

    /**
     * Get audit logs for a specific user
     */
    @GetMapping("/logs/user/{userEmail}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public Map<String, Object> getUserAuditLogs(
            @PathVariable String userEmail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String tenantId = TenantContext.getCurrentTenant();
        Page<AuditLog> logs = auditLogService.getAuditLogsByUser(tenantId, userEmail, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        return response;
    }

    /**
     * Get audit logs by action type
     */
    @GetMapping("/logs/action/{actionType}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public Map<String, Object> getLogsByActionType(
            @PathVariable AuditActionType actionType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String tenantId = TenantContext.getCurrentTenant();
        Page<AuditLog> logs = auditLogService.getAuditLogsByActionType(tenantId, actionType, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        return response;
    }

    /**
     * Get failed operations
     */
    @GetMapping("/logs/failures")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public Map<String, Object> getFailedOperations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String tenantId = TenantContext.getCurrentTenant();
        Page<AuditLog> logs = auditLogService.getFailedOperations(tenantId, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        return response;
    }

    /**
     * Get entity history (all changes to a specific resource)
     */
    @GetMapping("/logs/entity/{entityId}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public Map<String, Object> getEntityHistory(@PathVariable String entityId) {
        String tenantId = TenantContext.getCurrentTenant();
        List<AuditLog> history = auditLogService.getEntityHistory(tenantId, entityId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", history);
        return response;
    }

    /**
     * Get user's recent activities (for personal activity feed)
     */
    @GetMapping("/my-activities")
    public Map<String, Object> getMyRecentActivities() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = (authentication != null) ? authentication.getName() : null;
        String tenantId = TenantContext.getCurrentTenant();

        if (userEmail == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User not authenticated");
            return error;
        }

        List<AuditLog> activities = auditLogService.getMyRecentActivities(tenantId, userEmail);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", activities);
        return response;
    }

    /**
     * Get audit summary statistics for the tenant
     */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'SUPER_ADMIN')")
    public Map<String, Object> getAuditSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        String tenantId = TenantContext.getCurrentTenant();
        
        // Fetch logs for the period
        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
        
        Page<AuditLog> logs = auditLogService.getAuditLogsByDateRange(tenantId, start, end, 0, Integer.MAX_VALUE);
        
        // Calculate statistics
        long totalActivities = logs.getTotalElements();
        long failedActivities = auditLogService.getFailedOperations(tenantId, 0, Integer.MAX_VALUE).getTotalElements();
        long successActivities = totalActivities - failedActivities;

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", Map.of(
            "totalActivities", totalActivities,
            "successActivities", successActivities,
            "failedActivities", failedActivities,
            "successRate", totalActivities > 0 ? (double) successActivities / totalActivities * 100 : 0,
            "startDate", start,
            "endDate", end
        ));
        return response;
    }
}
