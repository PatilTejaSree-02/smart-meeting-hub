package com.project.smartmeetingroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.RoomRepository;

@Service
public class AdminRoomService {

    private final RoomRepository roomRepository;

    public AdminRoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /* ================= LIST ALL ROOMS ================= */

    public List<Room> getAllRooms(Long tenantId) {
        return roomRepository.findByTenantId(tenantId);
    }

    /* ================= CREATE ROOM ================= */

    public Room createRoom(Room room, Long tenantId) {

        if (roomRepository.existsByNameAndTenantId(room.getName(), tenantId)) {
            throw new RuntimeException("Room already exists");
        }

        room.setTenantId(tenantId);
        room.setIsActive(true);

        return roomRepository.save(room);
    }

    /* ================= UPDATE ROOM ================= */

    public Room updateRoom(Long roomId, Room updated, Long tenantId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access");
        }

        room.setName(updated.getName());
        room.setCapacity(updated.getCapacity());
        room.setFloor(updated.getFloor());
        room.setBuilding(updated.getBuilding());
        room.setDescription(updated.getDescription());
        room.setImageUrl(updated.getImageUrl());

        return roomRepository.save(room);
    }

    /* ================= DEACTIVATE ROOM ================= */

    public void deactivateRoom(Long roomId, Long tenantId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access");
        }

        room.setIsActive(false);
        roomRepository.save(room);
    }
}
