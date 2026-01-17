package com.project.smartmeetingroom.dto;

import java.util.List;

public class AdminAnalyticsResponse {

    private long totalRooms;
    private long totalUsers;
    private long totalBookings;
    private long bookingsToday;
    private double occupancyRate;

    private List<BookingByDay> bookingsByDay;
    private List<BookingByRoom> bookingsByRoom;

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getBookingsToday() { return bookingsToday; }
    public void setBookingsToday(long bookingsToday) { this.bookingsToday = bookingsToday; }

    public double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(double occupancyRate) { this.occupancyRate = occupancyRate; }

    public List<BookingByDay> getBookingsByDay() { return bookingsByDay; }
    public void setBookingsByDay(List<BookingByDay> bookingsByDay) { this.bookingsByDay = bookingsByDay; }

    public List<BookingByRoom> getBookingsByRoom() { return bookingsByRoom; }
    public void setBookingsByRoom(List<BookingByRoom> bookingsByRoom) { this.bookingsByRoom = bookingsByRoom; }

    // ✅ Inner classes
    public static class BookingByDay {
        private String day;
        private long count;

        public BookingByDay(String day, long count) {
            this.day = day;
            this.count = count;
        }

        public String getDay() { return day; }
        public long getCount() { return count; }
    }

    public static class BookingByRoom {
        private String roomName;
        private long count;

        public BookingByRoom(String roomName, long count) {
            this.roomName = roomName;
            this.count = count;
        }

        public String getRoomName() { return roomName; }
        public long getCount() { return count; }
    }
}
