package com.project.smartmeetingroom.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_history")
public class BookingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(nullable = false)
    private String action;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /* ===== GETTERS & SETTERS ===== */

    public Long getId() { return id; }

    public Long getBookingId() { return bookingId; }

    public String getAction() { return action; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }

    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public void setAction(String action) { this.action = action; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
