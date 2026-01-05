package com.project.smartmeetingroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.CreateOrUpdateRoomRequest;
import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.AdminRoomRepository;

@Service
public class AdminRoomService {

    private final AdminRoomRepository adminRoomRepository;

    public AdminRoomService(AdminRoomRepository adminRoomRepository) {
        this.adminRoomRepository = adminRoomRepository;
    }

    public List<Room> getAllRooms(Long tenantId) {
        return adminRoomRepository.findByTenantId(tenantId);
    }

    public Room createRoom(CreateOrUpdateRoomRequest request) {

        Room room = new Room();
        room.setName(request.getName());
        room.setLocation(request.getLocation());
        room.setCapacity(request.getCapacity());
        room.setTenantId(request.getTenantId());
        room.setActive(true);

        return adminRoomRepository.save(room);
    }

    public Room updateRoom(Long roomId, CreateOrUpdateRoomRequest request) {

        Room room = adminRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setName(request.getName());
        room.setLocation(request.getLocation());
        room.setCapacity(request.getCapacity());

        return adminRoomRepository.save(room);
    }

    public void deactivateRoom(Long roomId) {

        Room room = adminRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setActive(false);
        adminRoomRepository.save(room);
    }
}
