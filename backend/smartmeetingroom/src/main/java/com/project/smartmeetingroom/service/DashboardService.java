package com.project.smartmeetingroom.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.DashboardStatsResponse;
import com.project.smartmeetingroom.repository.DashboardRepository;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public DashboardStatsResponse getStats(Long tenantId) {

        long totalRooms = dashboardRepository.countByTenantId(tenantId);
        long totalBookings = dashboardRepository.countBookingsByTenant(tenantId);
        long activeBookingsToday =
                dashboardRepository.countActiveBookings(tenantId, LocalDateTime.now());

        return new DashboardStatsResponse(
                totalRooms,
                totalBookings,
                activeBookingsToday
        );
    }
}
