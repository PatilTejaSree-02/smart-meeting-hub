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

    // ---------------- LIST ROOMS ----------------
    public List<Room> getActiveRooms(Long tenantId) {
        return roomRepository.findByTenantIdAndIsActiveTrue(tenantId);
    }

    // ---------------- ROOM DETAILS ----------------
    public Room getRoom(Long roomId, Long tenantId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return room;
    }
}
