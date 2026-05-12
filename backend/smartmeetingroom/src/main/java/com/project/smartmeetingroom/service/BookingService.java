package com.project.smartmeetingroom.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.BookingResponse;
import com.project.smartmeetingroom.dto.CreateBookingRequest;
import com.project.smartmeetingroom.dto.RescheduleBookingRequest;

import com.project.smartmeetingroom.entity.Booking;
import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.entity.User;

import com.project.smartmeetingroom.repository.BookingRepository;
import com.project.smartmeetingroom.repository.RoomRepository;
import com.project.smartmeetingroom.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            EmailService emailService
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    /* ================= CREATE ================= */

    public BookingResponse createBooking(
            CreateBookingRequest request
    ) {

        boolean conflict = bookingRepository.hasConflict(
                request.getRoomId(),
                request.getTenantId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (conflict) {
            throw new RuntimeException(
                    "Room already booked for this time slot"
            );
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

        Room room = roomRepository.findById(
                saved.getRoomId()
        ).orElse(null);

        User employee = userRepository
                .findByIdAndTenantId(
                        saved.getUserId(),
                        saved.getTenantId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found"
                        )
                );

        User admin = userRepository
                .findByTenantIdAndRole(
                        saved.getTenantId(),
                        "ROLE_ADMIN"
                )
                .orElse(null);

        /* EMPLOYEE MAIL */

        emailService.sendEmail(
                employee.getEmail(),
                "Room Meeting Slot Booking Confirmed",
                "Your Meeting Room Slot booking has been confirmed.\n\n" +
                        "Room: " +
                        (room != null ? room.getName() : "Unknown") +
                        "\n" +

                        "Title: " +
                        saved.getTitle() +
                        "\n" +

                        "Date: " +
                        saved.getBookingDate() +
                        "\n" +

                        "Time: " +
                        saved.getStartTime() +
                        " - " +
                        saved.getEndTime()
        );

        /* ADMIN MAIL */

        if (admin != null) {

            emailService.sendEmail(
                    admin.getEmail(),
                    "New Room Booking",
                    "A new room booking was created.\n\n" +
                            "Employee: " +
                            employee.getFirstName() +
                            " " +
                            employee.getLastName() +
                            "\n" +

                            "Room: " +
                            (room != null ? room.getName() : "Unknown") +
                            "\n" +

                            "Title: " +
                            saved.getTitle() +
                            "\n" +

                            "Date: " +
                            saved.getBookingDate()
            );
        }

        return mapToResponse(saved);
    }

    /* ================= USER BOOKINGS ================= */

    public List<BookingResponse> getUserBookings(
            Long userId,
            Long tenantId
    ) {

        return bookingRepository
                .findByUserIdAndTenantId(
                        userId,
                        tenantId
                )
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

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        )
                );

        if (!booking.getTenantId().equals(tenantId)) {
            throw new RuntimeException(
                    "Unauthorized booking access"
            );
        }

        if (!"confirmed".equals(booking.getStatus())) {
            throw new RuntimeException(
                    "Only confirmed bookings can be rescheduled"
            );
        }

        boolean conflict = bookingRepository.hasConflict(
                booking.getRoomId(),
                tenantId,
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (conflict) {
            throw new RuntimeException(
                    "Room already booked for the new time slot"
            );
        }

        booking.setBookingDate(
                request.getBookingDate()
        );

        booking.setStartTime(
                request.getStartTime()
        );

        booking.setEndTime(
                request.getEndTime()
        );

        Booking updated = bookingRepository.save(booking);

        Room room = roomRepository.findById(
                updated.getRoomId()
        ).orElse(null);

        User employee = userRepository
                .findByIdAndTenantId(
                        updated.getUserId(),
                        updated.getTenantId()
                )
                .orElse(null);

        User admin = userRepository
                .findByTenantIdAndRole(
                        updated.getTenantId(),
                        "ROLE_ADMIN"
                )
                .orElse(null);

        /* EMPLOYEE MAIL */

        if (employee != null) {

            emailService.sendEmail(
                    employee.getEmail(),
                    "Meeting Room Slot Booking Rescheduled",
                    "Your Meeting Room Slot booking has been rescheduled.\n\n" +
                            "Room: " +
                            (room != null ? room.getName() : "Unknown") +
                            "\n" +

                            "New Date: " +
                            updated.getBookingDate() +
                            "\n" +

                            "New Time: " +
                            updated.getStartTime() +
                            " - " +
                            updated.getEndTime()
            );
        }

        /* ADMIN MAIL */

        if (admin != null) {

            emailService.sendEmail(
                    admin.getEmail(),
                    "Meeting Room Slot Booking Rescheduled",
                    "A Meeting Room Slot booking has been rescheduled.\n\n" +
                            "Room: " +
                            (room != null ? room.getName() : "Unknown")
            );
        }

        return mapToResponse(updated);
    }

    /* ================= CANCEL ================= */

    public void cancelBooking(
            Long bookingId,
            Long tenantId
    ) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        )
                );

        if (!booking.getTenantId().equals(tenantId)) {
            throw new RuntimeException(
                    "Unauthorized booking access"
            );
        }

        booking.setStatus("cancelled");

        bookingRepository.save(booking);

        Room room = roomRepository.findById(
                booking.getRoomId()
        ).orElse(null);

        User employee = userRepository
                .findByIdAndTenantId(
                        booking.getUserId(),
                        booking.getTenantId()
                )
                .orElse(null);

        User admin = userRepository
                .findByTenantIdAndRole(
                        booking.getTenantId(),
                        "ROLE_ADMIN"
                )
                .orElse(null);

        /* EMPLOYEE MAIL */

        if (employee != null) {

            emailService.sendEmail(
                    employee.getEmail(),
                    "Booking Cancelled",
                    "Your Meeting Room Slot booking has been cancelled.\n\n" +
                            "Room: " +
                            (room != null ? room.getName() : "Unknown")
            );
        }

        /* ADMIN MAIL */

        if (admin != null) {

            emailService.sendEmail(
                    admin.getEmail(),
                    "Booking Cancelled",
                    "A Meeting Room Slot booking has been cancelled.\n\n" +
                            "Room: " +
                            (room != null ? room.getName() : "Unknown")
            );
        }
    }

    /* ================= ADMIN ================= */

    public List<BookingResponse> getAllBookings(
            Long tenantId
    ) {

        return bookingRepository.findByTenantId(
                tenantId
        )
        .stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
    }

    /* ================= MAPPER ================= */

    private BookingResponse mapToResponse(
            Booking booking
    ) {

        Room room = roomRepository
                .findById(booking.getRoomId())
                .orElse(null);

        BookingResponse res = new BookingResponse();

        res.setId(booking.getId());
        res.setRoomId(booking.getRoomId());

        res.setRoomName(
                room != null
                        ? room.getName()
                        : "Unknown"
        );

        res.setTitle(booking.getTitle());

        res.setBookingDate(
                booking.getBookingDate()
        );

        res.setStartTime(
                booking.getStartTime()
        );

        res.setEndTime(
                booking.getEndTime()
        );

        res.setAttendees(
                booking.getAttendees()
        );

        res.setStatus(
                booking.getStatus()
        );

        return res;
    }
}