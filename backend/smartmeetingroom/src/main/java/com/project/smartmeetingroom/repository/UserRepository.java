package com.project.smartmeetingroom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    long countByTenantId(Long tenantId);

    Optional<User> findByEmailAndTenantId(String email, Long tenantId);
}
