package com.project.smartmeetingroom.repository;

import com.project.smartmeetingroom.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndTenantId(
            String email,
            Long tenantId
    );

    Optional<User> findByIdAndTenantId(
            Long id,
            Long tenantId
    );

    Optional<User> findByTenantIdAndRole(
            Long tenantId,
            String role
    );

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmailOnly(
            @Param("email") String email
    );

    List<User> findByTenantId(Long tenantId);

    Optional<User> findByEmailAndStatus(
            String email,
            User.Status status
    );

    long countByTenantId(Long tenantId);
}