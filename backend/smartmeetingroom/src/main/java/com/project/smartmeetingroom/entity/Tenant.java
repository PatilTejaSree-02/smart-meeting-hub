package com.project.smartmeetingroom.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String subdomain;

    @Column(nullable = false)
    private String status;

    @Column(name = "company_email", nullable = false)
    private String companyEmail;

    @Column(name = "plan_type")
    private String planType;

    @Column(name = "max_users")
    private Integer maxUsers;

    @Column(name = "max_rooms")
    private Integer maxRooms;

    @Column(name = "max_bookings_per_month")
    private Integer maxBookingsPerMonth;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /* ===== GETTERS & SETTERS ===== */

    public Long getId() { return id; }

    public String getCompanyName() { return companyName; }

    public String getSubdomain() { return subdomain; }

    public String getStatus() { return status; }

    public String getCompanyEmail() { return companyEmail; }

    public String getPlanType() { return planType; }

    public Integer getMaxUsers() { return maxUsers; }

    public Integer getMaxRooms() { return maxRooms; }

    public Integer getMaxBookingsPerMonth() { return maxBookingsPerMonth; }

    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public void setSubdomain(String subdomain) { this.subdomain = subdomain; }

    public void setStatus(String status) { this.status = status; }

    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public void setPlanType(String planType) { this.planType = planType; }

    public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }

    public void setMaxRooms(Integer maxRooms) { this.maxRooms = maxRooms; }

    public void setMaxBookingsPerMonth(Integer maxBookingsPerMonth) {
        this.maxBookingsPerMonth = maxBookingsPerMonth;
    }
}
