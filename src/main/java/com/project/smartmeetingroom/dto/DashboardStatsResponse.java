package com.project.smartmeetingroom.dto;

public class DashboardStatsResponse {

    private long totalRooms;
    private long totalBookings;
    private long activeBookingsToday;

    public DashboardStatsResponse(
            long totalRooms,
            long totalBookings,
            long activeBookingsToday
    ) {
        this.totalRooms = totalRooms;
        this.totalBookings = totalBookings;
        this.activeBookingsToday = activeBookingsToday;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public long getActiveBookingsToday() {
        return activeBookingsToday;
    }
}
