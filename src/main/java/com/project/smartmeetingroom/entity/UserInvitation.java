package com.project.smartmeetingroom.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "user_invitations")
public class UserInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private String status;

    /* ===== GETTERS & SETTERS ===== */

    public Long getId() { return id; }

    public Long getTenantId() { return tenantId; }

    public String getEmail() { return email; }

    public String getRole() { return role; }

    public String getToken() { return token; }

    public LocalDateTime getExpiresAt() { return expiresAt; }

    public String getStatus() { return status; }

    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public void setEmail(String email) { this.email = email; }

    public void setRole(String role) { this.role = role; }

    public void setToken(String token) { this.token = token; }

    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public void setStatus(String status) { this.status = status; }
}
