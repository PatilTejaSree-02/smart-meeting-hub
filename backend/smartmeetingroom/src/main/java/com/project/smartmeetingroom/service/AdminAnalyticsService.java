package com.project.smartmeetingroom.service;

import com.project.smartmeetingroom.dto.AdminAnalyticsResponse;
import com.project.smartmeetingroom.repository.BookingRepository;
import com.project.smartmeetingroom.repository.RoomRepository;
import com.project.smartmeetingroom.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AdminAnalyticsService {

    private final RoomRepository roomRepo;
    private final UserRepository userRepo;
    private final BookingRepository bookingRepo;

    public AdminAnalyticsService(
            RoomRepository roomRepo,
            UserRepository userRepo,
            BookingRepository bookingRepo) {
        this.roomRepo = roomRepo;
        this.userRepo = userRepo;
        this.bookingRepo = bookingRepo;
    }

    public AdminAnalyticsResponse getAnalytics(Long tenantId) {

        AdminAnalyticsResponse res = new AdminAnalyticsResponse();

        res.totalRooms = roomRepo.countByTenantId(tenantId);
        res.totalUsers = userRepo.countByTenantId(tenantId);

        res.activeBookingsToday =
                bookingRepo.countByTenantIdAndBookingDate(
                        tenantId, LocalDate.now());

        long totalBookings = bookingRepo.countByTenantId(tenantId);
        long totalCapacity = roomRepo.sumCapacityByTenantId(tenantId);

        if (totalCapacity == 0) {
            res.averageOccupancy = 0;
        } else {
            res.averageOccupancy = (double) totalBookings / totalCapacity * 100;
        }

        res.bookingsByDay = bookingRepo.bookingsByDay(tenantId);
        res.bookingsByRoom = bookingRepo.bookingsByRoom(tenantId);

        return res;
    }
}
