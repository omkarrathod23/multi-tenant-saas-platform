package com.saas.config;

import com.saas.entity.AuditActionType;
import com.saas.entity.AuditEntityType;
import com.saas.service.AuditLogService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * AOP Aspect for automatic audit logging of CRUD operations
 * and other auditable actions
 */
@Aspect
@Component
public class AuditAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuditAspect.class);

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Log successful user service method calls
     * Applies to methods in UserService class
     */
    @After("execution(* com.saas.service.UserService.createUser(..)) && args(request)")
    public void logUserCreation(JoinPoint joinPoint, Object request) {
        try {
            // Extract entity info from request
            String details = "User created via " + joinPoint.getSignature().getName();
            auditLogService.logActivity(
                AuditActionType.CREATE,
                AuditEntityType.USER,
                "dynamic",
                "User",
                details
            );
            logger.debug("Logged user creation event");
        } catch (Exception e) {
            logger.error("Error in audit aspect for user creation", e);
        }
    }

    /**
     * Log user update operations
     */
    @After("execution(* com.saas.service.UserService.updateUser(..)) && args(id, request)")
    public void logUserUpdate(JoinPoint joinPoint, Object id, Object request) {
        try {
            String details = "User updated with ID: " + id;
            auditLogService.logActivity(
                AuditActionType.UPDATE,
                AuditEntityType.USER,
                id.toString(),
                "User",
                details
            );
            logger.debug("Logged user update event");
        } catch (Exception e) {
            logger.error("Error in audit aspect for user update", e);
        }
    }

    /**
     * Log user deletion
     */
    @After("execution(* com.saas.service.UserService.deleteUser(..)) && args(id)")
    public void logUserDelete(JoinPoint joinPoint, Object id) {
        try {
            String details = "User deleted with ID: " + id;
            auditLogService.logActivity(
                AuditActionType.DELETE,
                AuditEntityType.USER,
                id.toString(),
                "User",
                details
            );
            logger.debug("Logged user deletion event");
        } catch (Exception e) {
            logger.error("Error in audit aspect for user deletion", e);
        }
    }

    /**
     * Log role changes
     */
    @After("execution(* com.saas.service.UserService.updateUserRole(..)) && args(userId, newRole)")
    public void logRoleChange(JoinPoint joinPoint, Object userId, Object newRole) {
        try {
            String details = "User role changed to: " + newRole;
            auditLogService.logActivity(
                AuditActionType.ROLE_CHANGE,
                AuditEntityType.ROLE,
                userId.toString(),
                "User Role",
                details
            );
            logger.debug("Logged role change event");
        } catch (Exception e) {
            logger.error("Error in audit aspect for role change", e);
        }
    }

    /**
     * Log failed operations
     */
    @AfterThrowing(pointcut = "execution(* com.saas.service.UserService.*(..))", throwing = "e")
    public void logUserServiceFailure(JoinPoint joinPoint, Exception e) {
        try {
            String methodName = joinPoint.getSignature().getName();
            String details = "Failed operation: " + methodName;
            
            AuditActionType actionType = determineActionType(methodName);
            auditLogService.logFailure(
                actionType,
                AuditEntityType.USER,
                "unknown",
                e.getMessage()
            );
            logger.debug("Logged user service failure");
        } catch (Exception ex) {
            logger.error("Error logging user service failure", ex);
        }
    }

    /**
     * Helper: Determine action type based on method name
     */
    private AuditActionType determineActionType(String methodName) {
        if (methodName.contains("create")) return AuditActionType.CREATE;
        if (methodName.contains("update")) return AuditActionType.UPDATE;
        if (methodName.contains("delete")) return AuditActionType.DELETE;
        if (methodName.contains("role")) return AuditActionType.ROLE_CHANGE;
        return AuditActionType.OTHER;
    }
}
