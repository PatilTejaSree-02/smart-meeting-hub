package com.project.smartmeetingroom.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.dto.DayCountDTO;
import com.project.smartmeetingroom.dto.RoomCountDTO;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ✅ 1️⃣ Check overlapping bookings (your existing logic)
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

    // ✅ 2️⃣ Get bookings for a specific user
    List<Booking> findByTenantIdAndUserId(Long tenantId, Long userId);

    // ✅ 3️⃣ Count bookings by day (used in dashboard charts)
    @Query("""
        SELECT b.bookingDate AS day, COUNT(b) AS count
        FROM Booking b
        GROUP BY b.bookingDate
        ORDER BY b.bookingDate DESC
    """)
    List<DayCountDTO> countBookingsByDay();

    // ✅ 4️⃣ Count bookings per room (requires join with rooms)
    @Query(value = """
        SELECT r.name AS roomName, COUNT(b.id) AS count
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        GROUP BY r.name
        ORDER BY COUNT(b.id) DESC
    """, nativeQuery = true)
    List<RoomCountDTO> countBookingsByRoom();

    // ✅ 5️⃣ Count bookings for today (for active bookings stat)
    long countByBookingDateAndStatus(LocalDate bookingDate, String status);
}
