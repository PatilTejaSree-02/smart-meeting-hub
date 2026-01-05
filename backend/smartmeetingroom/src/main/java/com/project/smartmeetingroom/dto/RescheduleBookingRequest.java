package com.project.smartmeetingroom.dto;

import java.time.LocalDateTime;

public class RescheduleBookingRequest {

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public RescheduleBookingRequest() {}

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
