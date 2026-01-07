package com.project.smartmeetingroom.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @Column(name="email",nullable = false)
    private String email;

   @Column(name = "password_hash", nullable = false)
    private String passwordHash;


    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name="role",nullable = false)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false)
    private Status status;
    
    @Column(name="department",nullable=false)
    private String department;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    

    public enum Status {
        active,
        inactive,
        suspended,
        pending
    }
    /* ===== GETTERS & SETTERS ===== */

    public Long getId() { return id; }

    public Long getTenantId() { return tenantId; }

    public String getEmail() { return email; }

    public String getPassword() { return passwordHash; }

    public String getPasswordHash() { return passwordHash; }

    public String getFirstName() { return firstName; }

    public String getLastName() { return lastName; }

    public String getRole() { return role; }

    public Status getStatus() { return status; }

    public String getDepartment() { return department; }

    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public void setEmail(String email) { this.email = email; }

    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public void setRole(String role) { this.role = role; }

    public void setStatus(Status status) { this.status = status; }

    public void setDepartment(String department) { this.department = department; }
}
