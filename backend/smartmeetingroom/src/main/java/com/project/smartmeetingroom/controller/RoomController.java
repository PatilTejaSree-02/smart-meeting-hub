package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.service.RoomService;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // TEMP: tenantId passed explicitly (NO AUTH, NO MOCK)
    @GetMapping
    public List<Room> getRooms(@RequestParam Long tenantId) {
        return roomService.getAllRooms(tenantId);
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }
}
