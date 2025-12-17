package com.project.smartmeetingroom.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.smartmeetingroom.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 1️⃣ Check overlapping bookings (CORE LOGIC)
    @Query("""
        SELECT b FROM Booking b
        WHERE b.tenantId = :tenantId
          AND b.roomId = :roomId
          AND b.bookingDate = :bookingDate
          AND (
              (:startTime < b.endTime AND :endTime > b.startTime)
          )
    """)
    List<Booking> findOverlappingBookings(
            Long tenantId,
            Long roomId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime
    );

    // 2️⃣ Get bookings for a user
    List<Booking> findByTenantIdAndUserId(Long tenantId, Long userId);
}
