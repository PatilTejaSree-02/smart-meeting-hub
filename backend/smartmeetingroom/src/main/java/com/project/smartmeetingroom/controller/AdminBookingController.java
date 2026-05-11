package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.BookingResponse;
import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.dto.RescheduleBookingRequest;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.BookingService;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminBookingController {

    private final BookingService bookingService;
    private final JwtContextUtil jwt;

    public AdminBookingController(
            BookingService bookingService,
            JwtContextUtil jwt
    ) {
        this.bookingService = bookingService;
        this.jwt = jwt;
    }

    // ✅ GET ALL BOOKINGS (ADMIN)
    @GetMapping
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings(jwt.getTenantId());
    }

    // ✅ CREATE BOOKING (ADMIN)
    @PostMapping
    public BookingResponse createBooking(@RequestBody CreateBookingRequest request) {

        request.setTenantId(jwt.getTenantId());

        // if admin didn't give userId → use self
        if (request.getUserId() == null) {
            request.setUserId(jwt.getUserId());
        }

        return bookingService.createBooking(request);
    }

    // ✅ RESCHEDULE BOOKING
    @PutMapping("/{id}/reschedule")
    public BookingResponse rescheduleBooking(
            @PathVariable Long id,
            @RequestBody RescheduleBookingRequest request
    ) {
        return bookingService.rescheduleBooking(id, jwt.getTenantId(), request);
    }

    // ✅ CANCEL BOOKING
    @DeleteMapping("/{id}")
    public void cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id, jwt.getTenantId());
    }
}