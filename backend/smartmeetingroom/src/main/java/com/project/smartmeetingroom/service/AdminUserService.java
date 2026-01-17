package com.project.smartmeetingroom.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.CreateUserRequest;
import com.project.smartmeetingroom.dto.UpdateUserRequest;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.UserRepository;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers(Long tenantId) {
        return userRepository.findByTenantId(tenantId);
    }

    public User createUser(CreateUserRequest request, Long tenantId) {

        // ✅ check duplicates
        if (userRepository.findByEmailAndTenantId(request.getEmail(), tenantId).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        User user = new User();
        user.setTenantId(tenantId);
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDepartment(request.getDepartment());

        user.setRole(request.getRole() == null ? "ROLE_USER" : request.getRole());
        user.setStatus(User.Status.active);

        return userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserRequest request, Long tenantId) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access");
        }

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getStatus() != null) user.setStatus(request.getStatus());

        return userRepository.save(user);
    }

    public void deactivateUser(Long id, Long tenantId) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access");
        }

        user.setStatus(User.Status.inactive);
        userRepository.save(user);
    }
}
