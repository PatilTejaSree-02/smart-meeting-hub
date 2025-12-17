package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.repository.BookingRepository;
import com.project.smartmeetingroom.security.JwtContextUtil;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private JwtContextUtil jwtContextUtil;

    // ✅ CREATE BOOKING
    @PostMapping
    public Booking createBooking(@RequestBody CreateBookingRequest request) {

        Long tenantId = jwtContextUtil.getTenantId();
        Long userId = jwtContextUtil.getUserId();

        // 1️⃣ Validate time
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Start time must be before end time"
            );
        }

        // 2️⃣ Check overlap
        List<Booking> conflicts =
                bookingRepository.findOverlappingBookings(
                        tenantId,
                        request.getRoomId(),
                        request.getBookingDate(),
                        request.getStartTime(),
                        request.getEndTime()
                );

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Room already booked for this time slot"
            );
        }

        // 3️⃣ Save booking
        Booking booking = new Booking();
        booking.setTenantId(tenantId);
        booking.setUserId(userId);
        booking.setRoomId(request.getRoomId());
        booking.setTitle(request.getTitle());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus("confirmed");

        return bookingRepository.save(booking);
    }

    // ✅ GET MY BOOKINGS
    @GetMapping
    public List<Booking> getMyBookings() {
        return bookingRepository.findByTenantIdAndUserId(
                jwtContextUtil.getTenantId(),
                jwtContextUtil.getUserId()
        );
    }
}
