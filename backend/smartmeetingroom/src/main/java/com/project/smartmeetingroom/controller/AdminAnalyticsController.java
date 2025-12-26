package com.project.smartmeetingroom.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import com.project.smartmeetingroom.repository.BookingRepository;
import com.project.smartmeetingroom.repository.RoomRepository;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.dto.DayCountDTO;
import com.project.smartmeetingroom.dto.RoomCountDTO;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminAnalyticsController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        analytics.put("totalRooms", roomRepository.count());
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalBookings", bookingRepository.count());

        long activeToday = bookingRepository.countByBookingDateAndStatus(
                java.time.LocalDate.now(), "confirmed");
        analytics.put("activeBookingsToday", activeToday);

        long totalRooms = roomRepository.count();
        long totalBookings = bookingRepository.count();
        analytics.put("averageOccupancy",
                totalRooms > 0 ? (int) ((double) totalBookings / totalRooms * 10) : 0);

        List<RoomCountDTO> bookingsByRoom = bookingRepository.countBookingsByRoom();
        List<DayCountDTO> bookingsByDay = bookingRepository.countBookingsByDay();

        analytics.put("bookingsByRoom", bookingsByRoom);
        analytics.put("bookingsByDay", bookingsByDay);

        return analytics;
    }
}
