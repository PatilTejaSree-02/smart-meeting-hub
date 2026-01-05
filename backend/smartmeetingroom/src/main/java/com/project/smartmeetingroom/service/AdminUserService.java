package com.project.smartmeetingroom.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.CreateUserRequest;
import com.project.smartmeetingroom.dto.UpdateUserRequest;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.AdminUserRepository;

@Service
public class AdminUserService {

    private final AdminUserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AdminUserService(AdminUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers(Long tenantId) {
        return userRepository.findByTenantId(tenantId);
    }

    public User createUser(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        user.setActive(true);

        return userRepository.save(user);
    }

    public User updateUser(Long userId, UpdateUserRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        return userRepository.save(user);
    }

    public void deactivateUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        userRepository.save(user);
    }
}
