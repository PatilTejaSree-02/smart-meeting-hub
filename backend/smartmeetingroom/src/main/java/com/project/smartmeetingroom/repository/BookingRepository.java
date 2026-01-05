package com.project.smartmeetingroom.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.smartmeetingroom.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // --------------------------------------------------
    // USER BOOKINGS
    // --------------------------------------------------
    List<Booking> findByUserIdAndTenantId(Long userId, Long tenantId);

    // --------------------------------------------------
    // CONFLICT CHECKING
    // --------------------------------------------------
    boolean existsByRoomIdAndTenantIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            Long roomId,
            Long tenantId,
            String status,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    boolean existsByRoomIdAndTenantIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
            Long roomId,
            Long tenantId,
            String status,
            LocalDateTime endTime,
            LocalDateTime startTime,
            Long excludeId
    );

    // --------------------------------------------------
    // SUMMARY COUNTS
    // --------------------------------------------------
    long countByTenantId(Long tenantId);

    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.tenantId = :tenantId
          AND DATE(b.startTime) = :date
    """)
    long countTodayBookings(
            @Param("tenantId") Long tenantId,
            @Param("date") LocalDate date
    );

    // --------------------------------------------------
    // ANALYTICS
    // --------------------------------------------------

    // returns: [ LocalDate, Long ]
    @Query("""
        SELECT DATE(b.startTime), COUNT(b)
        FROM Booking b
        WHERE b.tenantId = :tenantId
        GROUP BY DATE(b.startTime)
        ORDER BY DATE(b.startTime)
    """)
    List<Object[]> bookingsCountByDay(
            @Param("tenantId") Long tenantId
    );

    // returns: [ Long roomId, Long count ]
    @Query("""
        SELECT b.roomId, COUNT(b)
        FROM Booking b
        WHERE b.tenantId = :tenantId
        GROUP BY b.roomId
    """)
    List<Object[]> bookingsCountByRoom(
            @Param("tenantId") Long tenantId
    );
}
