package com.project.smartmeetingroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms(Long tenantId) {
        return roomRepository.findByTenantIdAndActiveTrue(tenantId);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}
