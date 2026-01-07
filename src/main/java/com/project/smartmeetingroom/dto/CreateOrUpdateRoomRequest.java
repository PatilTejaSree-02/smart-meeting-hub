package com.project.smartmeetingroom.dto;

public class CreateOrUpdateRoomRequest {

    private String name;
    private String location;
    private Integer capacity;
    private Long tenantId;

    public CreateOrUpdateRoomRequest() {}

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public Long getTenantId() {
        return tenantId;
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

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }
}
