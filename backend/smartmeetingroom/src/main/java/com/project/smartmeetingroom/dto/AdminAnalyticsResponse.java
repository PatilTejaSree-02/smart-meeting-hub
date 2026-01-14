package com.project.smartmeetingroom.dto;

import java.util.List;

public class AdminAnalyticsResponse {

    public long totalRooms;
    public long totalUsers;
    public long activeBookingsToday;
    public double averageOccupancy;

    public List<BookingByDay> bookingsByDay;
    public List<BookingByRoom> bookingsByRoom;

    // ===== Constructors required by JPQL =====

    public static class BookingByDay {
        public String day;
        public long count;

        public BookingByDay(String day, long count) {
            this.day = day;
            this.count = count;
        }
    }

    public static class BookingByRoom {
        public String roomName;
        public long count;

        public BookingByRoom(String roomName, long count) {
            this.roomName = roomName;
            this.count = count;
        }
    }
}
