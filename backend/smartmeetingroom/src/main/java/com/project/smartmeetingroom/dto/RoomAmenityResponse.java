package com.project.smartmeetingroom.dto;

public class RoomAmenityResponse {

    private Long amenityId;
    private String name;
    private String category;

    public RoomAmenityResponse(Long amenityId, String name, String category) {
        this.amenityId = amenityId;
        this.name = name;
        this.category = category;
    }

    public Long getAmenityId() { return amenityId; }
    public String getName() { return name; }
    public String getCategory() { return category; }
}
