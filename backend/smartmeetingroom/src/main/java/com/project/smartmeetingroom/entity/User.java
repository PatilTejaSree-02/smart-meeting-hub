package com.project.smartmeetingroom.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // ROLE_ADMIN, ROLE_USER

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    public User() {}

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public Boolean getActive() { return active; }
    public Long getTenantId() { return tenantId; }

    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setRole(String role) { this.role = role; }
    public void setActive(Boolean active) { this.active = active; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }
}
