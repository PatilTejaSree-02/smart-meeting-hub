package com.project.smartmeetingroom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.smartmeetingroom.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByTenantIdAndActiveTrue(Long tenantId);

    long countByTenantId(Long tenantId);


}
