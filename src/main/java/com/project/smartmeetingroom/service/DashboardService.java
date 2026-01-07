package com.project.smartmeetingroom.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.repository.BookingRepository;
import com.project.smartmeetingroom.repository.RoomRepository;
import com.project.smartmeetingroom.repository.UserRepository;

@Service
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public DashboardService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    // ---------------- USER DASHBOARD ----------------
    public UserDashboardData getUserDashboard(Long userId, Long tenantId) {

        long totalBookings =
                bookingRepository.countByUserIdAndTenantId(userId, tenantId);

        List<Booking> upcoming =
                bookingRepository.findByUserIdAndTenantIdAndBookingDateGreaterThanEqual(
                        userId,
                        tenantId,
                        LocalDate.now()
                );

        return new UserDashboardData(totalBookings, upcoming);
    }

    // ---------------- ADMIN DASHBOARD ----------------
    public AdminDashboardData getAdminDashboard(Long tenantId) {

        long totalUsers = userRepository.countByTenantId(tenantId);
        long totalRooms = roomRepository.countByTenantId(tenantId);
        long totalBookings = bookingRepository.countByTenantId(tenantId);

        return new AdminDashboardData(
                totalUsers,
                totalRooms,
                totalBookings
        );
    }

    // ---------------- DTOs ----------------
    public record UserDashboardData(
            long totalBookings,
            List<Booking> upcomingBookings
    ) {}

    public record AdminDashboardData(
            long totalUsers,
            long totalRooms,
            long totalBookings
    ) {}
}
