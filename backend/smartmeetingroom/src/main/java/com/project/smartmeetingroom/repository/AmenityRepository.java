package com.project.smartmeetingroom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.Amenity;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    List<Amenity> findByIsActiveTrue();

    boolean existsByNameIgnoreCase(String name);
}
