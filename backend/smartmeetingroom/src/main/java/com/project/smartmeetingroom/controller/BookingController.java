package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.dto.RescheduleBookingRequest;
import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CREATE
    @PostMapping
    public Booking createBooking(@RequestBody CreateBookingRequest request) {
        return bookingService.createBooking(request);
    }

    // LIST
    @GetMapping
    public List<Booking> getBookings(
            @RequestParam Long userId,
            @RequestParam Long tenantId
    ) {
        return bookingService.getBookingsForUser(userId, tenantId);
    }

    // RESCHEDULE
    @PutMapping("/{id}/reschedule")
    public Booking rescheduleBooking(
            @PathVariable Long id,
            @RequestParam Long tenantId,
            @RequestBody RescheduleBookingRequest request
    ) {
        return bookingService.rescheduleBooking(id, tenantId, request);
    }

    // CANCEL
    @PutMapping("/{id}/cancel")
    public void cancelBooking(
            @PathVariable Long id,
            @RequestParam Long tenantId
    ) {
        bookingService.cancelBooking(id, tenantId);
    }
}
