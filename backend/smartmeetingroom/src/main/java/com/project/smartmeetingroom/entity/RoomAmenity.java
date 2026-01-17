package com.project.smartmeetingroom.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "room_amenities",
        uniqueConstraints = @UniqueConstraint(columnNames = { "room_id", "amenity_id" })
)
public class RoomAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "amenity_id", nullable = false)
    private Long amenityId;

    public Long getId() { return id; }
    public Long getRoomId() { return roomId; }
    public Long getAmenityId() { return amenityId; }

    public void setId(Long id) { this.id = id; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public void setAmenityId(Long amenityId) { this.amenityId = amenityId; }
}
