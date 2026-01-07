package com.project.smartmeetingroom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndTenantId(String email, Long tenantId);

    List<User> findByTenantId(Long tenantId);
    
    long countByTenantId(Long tenantId);
    
    boolean existsByEmailAndTenantId(String email, Long tenantId);
}
