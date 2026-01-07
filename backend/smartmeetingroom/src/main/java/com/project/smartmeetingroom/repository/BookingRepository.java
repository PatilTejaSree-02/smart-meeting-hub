package com.project.smartmeetingroom.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByTenantId(Long tenantId);
    long countByTenantId(Long tenantId);
    boolean existsByRoomIdAndTenantIdAndBookingDateAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            Long roomId,
            Long tenantId,
            LocalDate bookingDate,
            String status,
            LocalTime endTime,
            LocalTime startTime
    );
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
}   
