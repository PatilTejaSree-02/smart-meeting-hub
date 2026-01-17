package com.project.smartmeetingroom.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.AdminAnalyticsResponse;
import com.project.smartmeetingroom.repository.BookingRepository;
import com.project.smartmeetingroom.repository.RoomRepository;
import com.project.smartmeetingroom.repository.UserRepository;

@Service
public class AdminAnalyticsService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public AdminAnalyticsService(
            RoomRepository roomRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository
    ) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public AdminAnalyticsResponse getAnalytics(Long tenantId) {

        AdminAnalyticsResponse res = new AdminAnalyticsResponse();

        long totalRooms = roomRepository.countByTenantId(tenantId);
        long totalUsers = userRepository.countByTenantId(tenantId);
        long totalBookings = bookingRepository.countByTenantId(tenantId);

        long bookingsToday = bookingRepository.countByTenantIdAndBookingDate(
                tenantId,
                LocalDate.now()
        );

        long totalCapacity = roomRepository.sumCapacityByTenantId(tenantId);

        // occupancy = (todayBookings / totalRooms) * 100 (simple metric)
        double occupancyRate = 0.0;
        if (totalRooms > 0) {
            occupancyRate = ((double) bookingsToday / totalRooms) * 100;
        }

        res.setTotalRooms(totalRooms);
        res.setTotalUsers(totalUsers);
        res.setTotalBookings(totalBookings);
        res.setBookingsToday(bookingsToday);
        res.setOccupancyRate(occupancyRate);

        res.setBookingsByDay(bookingRepository.bookingsByDay(tenantId));
        res.setBookingsByRoom(bookingRepository.bookingsByRoom(tenantId));

        return res;
    }
}
