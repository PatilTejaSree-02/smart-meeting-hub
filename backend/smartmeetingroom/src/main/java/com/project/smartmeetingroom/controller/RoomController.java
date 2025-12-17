package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.project.smartmeetingroom.dto.CreateRoomRequest;
import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.RoomRepository;
import com.project.smartmeetingroom.security.JwtContextUtil;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private JwtContextUtil jwtContextUtil;

    // ✅ GET rooms (tenant scoped)
    @GetMapping
    public List<Room> getRooms() {
        return roomRepository.findByTenantId(jwtContextUtil.getTenantId());
    }

    // ✅ CREATE room (admin only)
    @PostMapping
    public Room createRoom(@RequestBody CreateRoomRequest request) {

        if (!"admin".equalsIgnoreCase(jwtContextUtil.getRole())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Only admin can create rooms"
            );
        }

        Room room = new Room();
        room.setTenantId(jwtContextUtil.getTenantId());
        room.setName(request.getName());
        room.setDescription(request.getDescription());
        room.setCapacity(request.getCapacity());
        room.setFloor(request.getFloor());
        room.setBuilding(request.getBuilding());
        room.setActive(true);

        return roomRepository.save(room);
    }
}
