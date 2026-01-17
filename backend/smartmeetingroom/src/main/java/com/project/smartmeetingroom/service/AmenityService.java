package com.project.smartmeetingroom.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.RoomAmenityResponse;
import com.project.smartmeetingroom.entity.Amenity;
import com.project.smartmeetingroom.entity.Room;
import com.project.smartmeetingroom.entity.RoomAmenity;
import com.project.smartmeetingroom.repository.AmenityRepository;
import com.project.smartmeetingroom.repository.RoomAmenityRepository;
import com.project.smartmeetingroom.repository.RoomRepository;

@Service
public class AmenityService {

    private final AmenityRepository amenityRepository;
    private final RoomAmenityRepository roomAmenityRepository;
    private final RoomRepository roomRepository;

    public AmenityService(
            AmenityRepository amenityRepository,
            RoomAmenityRepository roomAmenityRepository,
            RoomRepository roomRepository
    ) {
        this.amenityRepository = amenityRepository;
        this.roomAmenityRepository = roomAmenityRepository;
        this.roomRepository = roomRepository;
    }

    /* ================= ALL AMENITIES (MASTER LIST) ================= */

    public List<Amenity> getAllAmenities() {
        return amenityRepository.findByIsActiveTrue();
    }

    public Amenity createAmenity(Amenity amenity) {
        if (amenityRepository.existsByNameIgnoreCase(amenity.getName())) {
            throw new RuntimeException("Amenity already exists");
        }
        amenity.setIsActive(true);
        return amenityRepository.save(amenity);
    }

    /* ================= ROOM AMENITIES ================= */

    private Room validateRoomTenant(Long roomId, Long tenantId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized tenant access");
        }

        return room;
    }

    public List<RoomAmenityResponse> getRoomAmenities(Long roomId, Long tenantId) {

        validateRoomTenant(roomId, tenantId);

        List<RoomAmenity> mappings = roomAmenityRepository.findByRoomId(roomId);

        return mappings.stream().map(mapping -> {
            Amenity amenity = amenityRepository.findById(mapping.getAmenityId())
                    .orElseThrow(() -> new RuntimeException("Amenity not found"));

            return new RoomAmenityResponse(
                    amenity.getId(),
                    amenity.getName(),
                    amenity.getCategory()
            );
        }).collect(Collectors.toList());
    }

    public void assignAmenityToRoom(Long roomId, Long amenityId, Long tenantId) {

        validateRoomTenant(roomId, tenantId);

        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new RuntimeException("Amenity not found"));

        if (!Boolean.TRUE.equals(amenity.getIsActive())) {
            throw new RuntimeException("Amenity is inactive");
        }

        if (roomAmenityRepository.existsByRoomIdAndAmenityId(roomId, amenityId)) {
            throw new RuntimeException("Amenity already assigned to this room");
        }

        RoomAmenity mapping = new RoomAmenity();
        mapping.setRoomId(roomId);
        mapping.setAmenityId(amenityId);

        roomAmenityRepository.save(mapping);
    }

    public void removeAmenityFromRoom(Long roomId, Long amenityId, Long tenantId) {

        validateRoomTenant(roomId, tenantId);

        if (!roomAmenityRepository.existsByRoomIdAndAmenityId(roomId, amenityId)) {
            throw new RuntimeException("Amenity is not assigned to this room");
        }

        roomAmenityRepository.deleteByRoomIdAndAmenityId(roomId, amenityId);
    }
}
