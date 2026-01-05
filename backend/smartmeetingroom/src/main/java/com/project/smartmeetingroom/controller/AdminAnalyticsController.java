package com.project.smartmeetingroom.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.repository.*;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.entity.*;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    private final JwtContextUtil jwt;
    private final TenantRepository tenantRepo;
    private final UserRepository userRepo;
    private final RoomRepository roomRepo;
    private final BookingRepository bookingRepo;

    public AdminAnalyticsController(
            JwtContextUtil jwt,
            TenantRepository tenantRepo,
            UserRepository userRepo,
            RoomRepository roomRepo,
            BookingRepository bookingRepo) {

        this.jwt = jwt;
        this.tenantRepo = tenantRepo;
        this.userRepo = userRepo;
        this.roomRepo = roomRepo;
        this.bookingRepo = bookingRepo;
    }

    private Long tenantId() {
        return jwt.getTenantId();
    }

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------
    @GetMapping("/summary")
    public Map<String, Object> summary() {

        if (!"ROLE_ADMIN".equals(jwt.getRole())) {
            throw new RuntimeException("Forbidden");
        }

        Long tenantId = tenantId();

        Map<String, Object> response = new HashMap<>();
        response.put("totalUsers", userRepo.countByTenantId(tenantId));
        response.put("totalRooms", roomRepo.countByTenantId(tenantId));
        response.put("totalBookings", bookingRepo.countByTenantId(tenantId));
        response.put(
                "todayBookings",
                bookingRepo.countTodayBookings(tenantId, LocalDate.now())
        );

        return response;
    }

    // --------------------------------------------------
    // BOOKINGS BY DAY
    // --------------------------------------------------
    @GetMapping("/bookings-by-day")
    public List<Map<String, Object>> bookingsByDay() {

        List<Object[]> rows = bookingRepo.bookingsCountByDay(tenantId());

        return rows.stream().map(row -> {
            Map<String, Object> m = new HashMap<>();
            m.put("day", row[0]);
            m.put("count", row[1]);
            return m;
        }).toList();
    }

    // --------------------------------------------------
    // BOOKINGS BY ROOM
    // --------------------------------------------------
    @GetMapping("/bookings-by-room")
    public List<Map<String, Object>> bookingsByRoom() {

        List<Object[]> rows = bookingRepo.bookingsCountByRoom(tenantId());

        return rows.stream().map(row -> {
            Map<String, Object> m = new HashMap<>();
            m.put("roomId", row[0]);
            m.put("count", row[1]);
            return m;
        }).toList();
    }
}
