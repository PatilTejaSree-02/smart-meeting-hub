package com.project.smartmeetingroom.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.smartmeetingroom.dto.AdminAnalyticsResponse;
import com.project.smartmeetingroom.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByTenantId(Long tenantId);
      List<Booking> findByUserIdAndTenantId(Long userId, Long tenantId);
    boolean existsByRoomIdAndTenantIdAndBookingDateAndStatusAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
            Long roomId,
            Long tenantId,
            LocalDate bookingDate,
            String status,
            LocalTime endTime,
            LocalTime startTime,
            Long id
    );
    long countByUserIdAndTenantId(Long userId, Long tenantId);

    List<Booking> findByUserIdAndTenantIdAndBookingDateGreaterThanEqual(
            Long userId,
            Long tenantId,
            LocalDate bookingDate
    );

    long countByTenantId(Long tenantId);

long countByTenantIdAndBookingDate(Long tenantId, LocalDate date);

@Query("""
SELECT new com.project.smartmeetingroom.dto.AdminAnalyticsResponse$BookingByDay(
    DAYNAME(b.bookingDate), COUNT(b)
)
FROM Booking b
WHERE b.tenantId = :tenantId
GROUP BY b.bookingDate, DAYNAME(b.bookingDate)

""")
List<AdminAnalyticsResponse.BookingByDay> bookingsByDay(Long tenantId);

@Query("""
SELECT new com.project.smartmeetingroom.dto.AdminAnalyticsResponse$BookingByRoom(
    r.name, COUNT(b)
)
FROM Booking b JOIN Room r ON b.roomId = r.id
WHERE b.tenantId = :tenantId
GROUP BY r.id, r.name

""")
List<AdminAnalyticsResponse.BookingByRoom> bookingsByRoom(Long tenantId);

@Query("""
SELECT (COUNT(b) > 0)
FROM Booking b
WHERE b.roomId = :roomId
AND b.tenantId = :tenantId
AND b.bookingDate = :date
AND b.status = 'confirmed'
AND b.startTime < :endTime
AND b.endTime > :startTime
""")
boolean hasConflict(
    @Param("roomId") Long roomId,
    @Param("tenantId") Long tenantId,
    @Param("date") LocalDate date,
    @Param("startTime") LocalTime startTime,
    @Param("endTime") LocalTime endTime
);


}   
