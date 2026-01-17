package com.project.smartmeetingroom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.RoomAmenity;

public interface RoomAmenityRepository extends JpaRepository<RoomAmenity, Long> {

    List<RoomAmenity> findByRoomId(Long roomId);

    boolean existsByRoomIdAndAmenityId(Long roomId, Long amenityId);

    void deleteByRoomIdAndAmenityId(Long roomId, Long amenityId);

    void deleteByRoomId(Long roomId);
}
