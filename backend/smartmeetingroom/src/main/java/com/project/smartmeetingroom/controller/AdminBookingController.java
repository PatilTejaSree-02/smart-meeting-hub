package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.dto.RescheduleBookingRequest;
import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.BookingService;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminBookingController {

    private final BookingService bookingService;
    private final JwtContextUtil jwt;

    public AdminBookingController(BookingService bookingService, JwtContextUtil jwt) {
        this.bookingService = bookingService;
        this.jwt = jwt;
    }

    // ✅ ADMIN: Get all bookings for this tenant
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings(jwt.getTenantId());
    }

    // ✅ ADMIN: Create booking (Admin can book for himself OR for any user)
    @PostMapping
    public Booking createBooking(@RequestBody CreateBookingRequest request) {

        // tenantId always from token
        request.setTenantId(jwt.getTenantId());

        // if userId is not provided -> admin booking for himself
        if (request.getUserId() == null) {
            request.setUserId(jwt.getUserId());
        }

        return bookingService.createBooking(request);
    }

    // ✅ ADMIN: Reschedule booking (update date/time)
    @PutMapping("/{id}/reschedule")
    public Booking rescheduleBooking(
            @PathVariable Long id,
            @RequestBody RescheduleBookingRequest request
    ) {
        return bookingService.rescheduleBooking(id, jwt.getTenantId(), request);
    }

    // ✅ ADMIN: Cancel booking
    @DeleteMapping("/{id}")
    public void cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id, jwt.getTenantId());
    }
}
