package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.repository.RoomRepository;
import com.project.smartmeetingroom.security.JwtContextUtil;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:8081")
public class RoomController {

    private final RoomRepository roomRepo;
    private final JwtContextUtil jwt;

    public RoomController(RoomRepository roomRepo, JwtContextUtil jwt) {
        this.roomRepo = roomRepo;
        this.jwt = jwt;
    }

    @GetMapping
    public List<Room> rooms() {
        return roomRepo.findByTenantIdAndIsActiveTrue(jwt.getTenantId());
    }

    @GetMapping("/{id}")
    public Room room(@PathVariable Long id) {
        return roomRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}
