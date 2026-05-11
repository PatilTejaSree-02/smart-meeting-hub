package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.BookingResponse;
import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:8081")
public class BookingController {

    private final BookingService bookingService;
    private final JwtContextUtil jwt;

    public BookingController(
            BookingService bookingService,
            JwtContextUtil jwt
    ) {
        this.bookingService = bookingService;
        this.jwt = jwt;
    }

    // ✅ GET USER BOOKINGS
    @GetMapping
    public List<BookingResponse> myBookings() {
        return bookingService.getUserBookings(
                jwt.getUserId(),
                jwt.getTenantId()
        );
    }

    // ✅ CREATE BOOKING
    @PostMapping
    public BookingResponse create(@RequestBody CreateBookingRequest request) {

        request.setUserId(jwt.getUserId());
        request.setTenantId(jwt.getTenantId());

        return bookingService.createBooking(request);
    }

    // ✅ CANCEL BOOKING
    @DeleteMapping("/{id}")
    public void cancel(@PathVariable Long id) {
        bookingService.cancelBooking(id, jwt.getTenantId());
    }
}