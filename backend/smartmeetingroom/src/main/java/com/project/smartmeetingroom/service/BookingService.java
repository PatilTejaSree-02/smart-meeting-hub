package com.project.smartmeetingroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.dto.RescheduleBookingRequest;
import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /* ================= CREATE ================= */

    public Booking createBooking(CreateBookingRequest request) {

        boolean conflict =
                bookingRepository
                        .existsByRoomIdAndTenantIdAndBookingDateAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                                request.getRoomId(),
                                request.getTenantId(),
                                request.getBookingDate(),
                                "confirmed",
                                request.getEndTime(),
                                request.getStartTime()
                        );

        if (conflict) {
            throw new RuntimeException("Room already booked for this time slot");
        }

        Booking booking = new Booking();
        booking.setTenantId(request.getTenantId());
        booking.setRoomId(request.getRoomId());
        booking.setUserId(request.getUserId());
        booking.setTitle(request.getTitle());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setAttendees(request.getAttendees());
        booking.setStatus("confirmed");

        return bookingRepository.save(booking);
    }

    /* ================= USER BOOKINGS ================= */

    public List<Booking> getUserBookings(Long userId, Long tenantId) {
        return bookingRepository.findByUserIdAndTenantId(userId, tenantId);
    }

    /* ================= RESCHEDULE ================= */

    public Booking rescheduleBooking(
            Long bookingId,
            Long tenantId,
            RescheduleBookingRequest request
    ) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized booking access");
        }

        if (!"confirmed".equals(booking.getStatus())) {
            throw new RuntimeException("Only confirmed bookings can be rescheduled");
        }

        boolean conflict =
                bookingRepository
                        .existsByRoomIdAndTenantIdAndBookingDateAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                                booking.getRoomId(),
                                tenantId,
                                request.getBookingDate(),
                                "confirmed",
                                request.getEndTime(),
                                request.getStartTime()
                        );

        if (conflict) {
            throw new RuntimeException("Room already booked for the new time slot");
        }

        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());

        return bookingRepository.save(booking);
    }

    /* ================= CANCEL ================= */

    public void cancelBooking(Long bookingId, Long tenantId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized booking access");
        }

        booking.setStatus("cancelled");
        bookingRepository.save(booking);
    }
}
