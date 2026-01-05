package com.project.smartmeetingroom.dto;

import java.time.LocalDateTime;

public class CreateBookingRequest {

    private Long roomId;
    private Long userId;
    private Long tenantId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public CreateBookingRequest() {}

    public Long getRoomId() {
        return roomId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
