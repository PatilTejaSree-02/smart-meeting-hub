package com.project.smartmeetingroom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.smartmeetingroom.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByTenantIdAndIsActiveTrue(Long tenantId);
    long countByTenantId(Long tenantId);

    @Query("SELECT COALESCE(SUM(r.capacity),0) FROM Room r WHERE r.tenantId = :tenantId")
    long sumCapacityByTenantId(Long tenantId);

    List<Room> findByTenantId(Long tenantId);

    boolean existsByNameAndTenantId(String name, Long tenantId);
}
