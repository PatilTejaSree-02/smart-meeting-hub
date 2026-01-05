package com.project.smartmeetingroom.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.entity.Room;

public interface DashboardRepository extends JpaRepository<Room, Long> {

    // Total rooms per tenant
    long countByTenantId(Long tenantId);

    // Total bookings per tenant
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.tenantId = :tenantId")
    long countBookingsByTenant(@Param("tenantId") Long tenantId);

    // Active bookings today
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.tenantId = :tenantId
        AND b.status = 'CONFIRMED'
        AND b.startTime <= :now
        AND b.endTime >= :now
    """)
    long countActiveBookings(
            @Param("tenantId") Long tenantId,
            @Param("now") LocalDateTime now
    );
}
