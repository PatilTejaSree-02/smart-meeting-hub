package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.AdminRoomService;

@RestController
@RequestMapping("/api/admin/rooms")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminRoomController {

    private final AdminRoomService roomService;
    private final JwtContextUtil jwt;

    public AdminRoomController(AdminRoomService roomService, JwtContextUtil jwt) {
        this.roomService = roomService;
        this.jwt = jwt;
    }

    @GetMapping
    public List<Room> getRooms() {
        return roomService.getAllRooms(jwt.getTenantId());
    }

    @PostMapping
    public Room create(@RequestBody Room room) {
        return roomService.createRoom(room, jwt.getTenantId());
    }

    // ✅ EDIT ROOM
    @PutMapping("/{id}")
    public Room update(@PathVariable Long id, @RequestBody Room updated) {
        return roomService.updateRoom(id, updated, jwt.getTenantId());
    }

    // ✅ DEACTIVATE ROOM
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomService.deactivateRoom(id, jwt.getTenantId());
    }
}
