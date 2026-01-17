package com.project.smartmeetingroom.controller;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.security.JwtContextUtil;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {

    private final UserRepository userRepository;
    private final JwtContextUtil jwt;

    public UserController(UserRepository userRepository, JwtContextUtil jwt) {
        this.userRepository = userRepository;
        this.jwt = jwt;
    }

    // ✅ Logged-in user details (for dashboard)
    @GetMapping("/me")
    public User me() {
        return userRepository.findById(jwt.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
