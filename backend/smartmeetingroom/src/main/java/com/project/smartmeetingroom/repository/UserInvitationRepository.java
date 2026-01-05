package com.project.smartmeetingroom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.smartmeetingroom.entity.UserInvitation;

public interface UserInvitationRepository
        extends JpaRepository<UserInvitation, Long> {

    Optional<UserInvitation> findByToken(String token);
}
