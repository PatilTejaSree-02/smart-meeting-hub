package com.project.smartmeetingroom.entity;

import java.time.Instant;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_history")
public class BookingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String action;

    private Instant createdAt = Instant.now();

    public Long getId() { return id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Instant getCreatedAt() { return createdAt; }
}
