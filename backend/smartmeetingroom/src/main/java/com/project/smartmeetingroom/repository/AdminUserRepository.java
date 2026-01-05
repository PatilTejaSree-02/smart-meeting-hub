package com.project.smartmeetingroom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.User;

public interface AdminUserRepository extends JpaRepository<User, Long> {

    List<User> findByTenantId(Long tenantId);

    boolean existsByEmail(String email);
}
