package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.CreateOrUpdateRoomRequest;
import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.service.AdminRoomService;

@RestController
@RequestMapping("/api/admin/rooms")
@CrossOrigin(origins = "*")
public class AdminRoomController {

    private final AdminRoomService adminRoomService;

    public AdminRoomController(AdminRoomService adminRoomService) {
        this.adminRoomService = adminRoomService;
    }

    // LIST ALL ROOMS (ADMIN)
    @GetMapping
    public List<Room> getRooms(@RequestParam Long tenantId) {
        return adminRoomService.getAllRooms(tenantId);
    }

    // CREATE ROOM
    @PostMapping
    public Room createRoom(@RequestBody CreateOrUpdateRoomRequest request) {
        return adminRoomService.createRoom(request);
    }

    // UPDATE ROOM
    @PutMapping("/{id}")
    public Room updateRoom(
            @PathVariable Long id,
            @RequestBody CreateOrUpdateRoomRequest request
    ) {
        return adminRoomService.updateRoom(id, request);
    }

    // DEACTIVATE ROOM (SOFT DELETE)
    @DeleteMapping("/{id}")
    public void deactivateRoom(@PathVariable Long id) {
        adminRoomService.deactivateRoom(id);
    }
}
