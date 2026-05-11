package com.project.smartmeetingroom.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.BookingResponse;
import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.dto.RescheduleBookingRequest;
import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.BookingRepository;
import com.project.smartmeetingroom.repository.RoomRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    /* ================= CREATE ================= */

    public BookingResponse createBooking(CreateBookingRequest request) {

        boolean conflict = bookingRepository.hasConflict(
                request.getRoomId(),
                request.getTenantId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
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

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }

    /* ================= USER BOOKINGS ================= */

    public List<BookingResponse> getUserBookings(Long userId, Long tenantId) {
        return bookingRepository.findByUserIdAndTenantId(userId, tenantId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /* ================= RESCHEDULE ================= */

    public BookingResponse rescheduleBooking(
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

        boolean conflict = bookingRepository.hasConflict(
                booking.getRoomId(),
                tenantId,
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (conflict) {
            throw new RuntimeException("Room already booked for the new time slot");
        }

        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());

        Booking updated = bookingRepository.save(booking);

        return mapToResponse(updated);
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

    /* ================= ADMIN ================= */

    public List<BookingResponse> getAllBookings(Long tenantId) {
        return bookingRepository.findByTenantId(tenantId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /* ================= MAPPER ================= */

    private BookingResponse mapToResponse(Booking booking) {

        Room room = roomRepository.findById(booking.getRoomId())
                .orElse(null);

        BookingResponse res = new BookingResponse();

        res.setId(booking.getId());
        res.setRoomId(booking.getRoomId());
        res.setRoomName(room != null ? room.getName() : "Unknown"); // ✅ FIX
        res.setTitle(booking.getTitle());
        res.setBookingDate(booking.getBookingDate());
        res.setStartTime(booking.getStartTime());
        res.setEndTime(booking.getEndTime());
        res.setAttendees(booking.getAttendees());
        res.setStatus(booking.getStatus());

        return res;
    }
}