package com.project.smartmeetingroom.dto;

public class CreateRoomRequest {

    private String name;
    private String description;
    private Integer capacity;
    private Integer floor;
    private String building;

    // ✅ NEW
    private String imageUrl;

    public String getName() { return name; }
    public String getDescription() { return description; }
    public Integer getCapacity() { return capacity; }
    public Integer getFloor() { return floor; }
    public String getBuilding() { return building; }
    public String getImageUrl() { return imageUrl; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public void setBuilding(String building) { this.building = building; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
