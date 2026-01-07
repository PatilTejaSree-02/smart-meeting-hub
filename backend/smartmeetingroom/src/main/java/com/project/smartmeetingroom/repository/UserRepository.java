package com.project.smartmeetingroom.repository;

import com.project.smartmeetingroom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // ORIGINAL METHOD (causes the issue - searches for NULL tenant)
    // Optional<User> findByEmailAndTenantId(String email, Integer tenantId);
    
    // NEW METHOD - Search by email only (no tenant filter)
    // This will find the user regardless of their tenant_id
    Optional<User> findByEmail(String email);
    
    // If you need tenant-specific search, keep this too
    Optional<User> findByEmailAndTenantId(String email, Long tenantId);
    
    // Search by email across all tenants (same as above but explicit)
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmailOnly(@Param("email") String email);
    
    // Find all users by tenant
    List<User> findByTenantId(Long tenantId);
    
    // Find active users only
    Optional<User> findByEmailAndStatus(String email, User.Status status);

    // Count users by tenant
    long countByTenantId(Long tenantId);
}