package com.project.smartmeetingroom.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer floor;

    private String building;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /* ===== GETTERS & SETTERS ===== */

    public Long getId() { return id; }

    public Long getTenantId() { return tenantId; }

    public String getName() { return name; }

    public String getDescription() { return description; }

    public Integer getCapacity() { return capacity; }

    public Integer getFloor() { return floor; }

    public String getBuilding() { return building; }

    public String getImageUrl() { return imageUrl; }

    public Boolean getIsActive() { return isActive; }

    public void setId(Long id) { this.id = id; }

    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public void setName(String name) { this.name = name; }

    public void setDescription(String description) { this.description = description; }

    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public void setFloor(Integer floor) { this.floor = floor; }

    public void setBuilding(String building) { this.building = building; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
