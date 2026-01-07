package com.project.smartmeetingroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.AdminRoomRepository;

@Service
public class AdminRoomService {

    private final AdminRoomRepository roomRepository;

    public AdminRoomService(AdminRoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getRooms(Long tenantId) {
        return roomRepository.findByTenantId(tenantId);
    }

    public Room createRoom(Room room, Long tenantId) {
        room.setTenantId(tenantId);
        room.setIsActive(true);
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updated) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setName(updated.getName());
        room.setDescription(updated.getDescription());
        room.setCapacity(updated.getCapacity());
        room.setFloor(updated.getFloor());
        room.setBuilding(updated.getBuilding());
        room.setImageUrl(updated.getImageUrl());
        room.setIsActive(updated.getIsActive());

        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
