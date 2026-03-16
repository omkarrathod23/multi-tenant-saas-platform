package com.saas.repository;

import com.saas.entity.AuditLog;
import com.saas.entity.AuditActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Multi-tenant queries
    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId ORDER BY a.createdAt DESC")
    Page<AuditLog> findByTenantId(@Param("tenantId") String tenantId, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.userEmail = :userEmail ORDER BY a.createdAt DESC")
    Page<AuditLog> findByTenantIdAndUserEmail(@Param("tenantId") String tenantId, 
                                               @Param("userEmail") String userEmail, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.actionType = :actionType ORDER BY a.createdAt DESC")
    Page<AuditLog> findByTenantIdAndActionType(@Param("tenantId") String tenantId, 
                                                @Param("actionType") AuditActionType actionType, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    Page<AuditLog> findByTenantIdAndDateRange(@Param("tenantId") String tenantId,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate,
                                               Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.userEmail = :userEmail AND a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    Page<AuditLog> findByTenantIdUserEmailAndDateRange(@Param("tenantId") String tenantId,
                                                        @Param("userEmail") String userEmail,
                                                        @Param("startDate") LocalDateTime startDate,
                                                        @Param("endDate") LocalDateTime endDate,
                                                        Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.entityId = :entityId ORDER BY a.createdAt DESC")
    List<AuditLog> findByTenantIdAndEntityId(@Param("tenantId") String tenantId, 
                                             @Param("entityId") String entityId);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.actionType IN :actionTypes ORDER BY a.createdAt DESC")
    Page<AuditLog> findByTenantIdAndActionTypes(@Param("tenantId") String tenantId,
                                                 @Param("actionTypes") List<AuditActionType> actionTypes,
                                                 Pageable pageable);

    // For failed operations
    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.status = 'FAILURE' ORDER BY a.createdAt DESC")
    Page<AuditLog> findFailedLogsByTenantId(@Param("tenantId") String tenantId, Pageable pageable);

    // Get recent activities for a user
    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.userEmail = :userEmail ORDER BY a.createdAt DESC LIMIT 50")
    List<AuditLog> findRecentActivitiesByUserEmail(@Param("tenantId") String tenantId,
                                                    @Param("userEmail") String userEmail);
}
