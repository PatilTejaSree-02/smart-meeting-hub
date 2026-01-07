package com.project.smartmeetingroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.Booking;

public interface DashboardRepository extends JpaRepository<Booking, Long> {
}
