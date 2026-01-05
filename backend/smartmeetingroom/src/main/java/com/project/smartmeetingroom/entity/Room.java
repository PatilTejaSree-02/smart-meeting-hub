package com.project.smartmeetingroom.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    public Room() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public Boolean getActive() {
        return active;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }
}
