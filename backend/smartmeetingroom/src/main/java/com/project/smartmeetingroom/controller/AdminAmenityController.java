package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.AssignAmenityRequest;
import com.project.smartmeetingroom.dto.RoomAmenityResponse;
import com.project.smartmeetingroom.entity.Amenity;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.AmenityService;

@RestController
@RequestMapping("/api/admin/amenities")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminAmenityController {

    private final AmenityService amenityService;
    private final JwtContextUtil jwt;

    public AdminAmenityController(AmenityService amenityService, JwtContextUtil jwt) {
        this.amenityService = amenityService;
        this.jwt = jwt;
    }

    // ✅ MASTER amenity list (same for all tenants)
    @GetMapping
    public List<Amenity> allAmenities() {
        return amenityService.getAllAmenities();
    }

    // ✅ create new amenity (optional feature)
    @PostMapping
    public Amenity createAmenity(@RequestBody Amenity amenity) {
        return amenityService.createAmenity(amenity);
    }

    // ✅ Get all amenities for a room
    @GetMapping("/room/{roomId}")
    public List<RoomAmenityResponse> getRoomAmenities(@PathVariable Long roomId) {
        return amenityService.getRoomAmenities(roomId, jwt.getTenantId());
    }

    // ✅ Assign amenity to room
    @PostMapping("/room/{roomId}")
    public void assignAmenity(
            @PathVariable Long roomId,
            @RequestBody AssignAmenityRequest req
    ) {
        amenityService.assignAmenityToRoom(roomId, req.getAmenityId(), jwt.getTenantId());
    }

    // ✅ Remove amenity from room
    @DeleteMapping("/room/{roomId}/{amenityId}")
    public void removeAmenity(
            @PathVariable Long roomId,
            @PathVariable Long amenityId
    ) {
        amenityService.removeAmenityFromRoom(roomId, amenityId, jwt.getTenantId());
    }
}
