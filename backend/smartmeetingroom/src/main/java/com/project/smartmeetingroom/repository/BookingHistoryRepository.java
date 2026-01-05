package com.project.smartmeetingroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.smartmeetingroom.entity.BookingHistory;

public interface BookingHistoryRepository
        extends JpaRepository<BookingHistory, Long> {
}
