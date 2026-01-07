package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.AdminRoomRepository;
import com.project.smartmeetingroom.security.JwtContextUtil;

@RestController
@RequestMapping("/api/admin/rooms")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminRoomController {

    private final AdminRoomRepository roomRepo;
    private final JwtContextUtil jwt;

    public AdminRoomController(
            AdminRoomRepository roomRepo,
            JwtContextUtil jwt) {
        this.roomRepo = roomRepo;
        this.jwt = jwt;
    }

    @GetMapping
    public List<Room> rooms() {
        return roomRepo.findByTenantId(jwt.getTenantId());
    }

    @PostMapping
    public Room create(@RequestBody Room room) {
        room.setTenantId(jwt.getTenantId());
        return roomRepo.save(room);
    }

    @PutMapping("/{id}")
    public Room update(@PathVariable Long id, @RequestBody Room updated) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setName(updated.getName());
        room.setCapacity(updated.getCapacity());
        room.setFloor(updated.getFloor());
        room.setBuilding(updated.getBuilding());
        room.setIsActive(updated.getIsActive());

        return roomRepo.save(room);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomRepo.deleteById(id);
    }
}
