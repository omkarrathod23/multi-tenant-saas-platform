package com.saas.repository;

import com.saas.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByTenantIdAndUserEmail(String tenantId, String userEmail);
}
