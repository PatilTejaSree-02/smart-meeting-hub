package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.CreateUserRequest;
import com.project.smartmeetingroom.dto.UpdateUserRequest;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final JwtContextUtil jwt;

    public AdminUserController(AdminUserService adminUserService, JwtContextUtil jwt) {
        this.adminUserService = adminUserService;
        this.jwt = jwt;
    }

    // ✅ Get all users (tenant-based)
    @GetMapping
    public List<User> getUsers() {
        return adminUserService.getAllUsers(jwt.getTenantId());
    }

    // ✅ Create user
    @PostMapping
    public User createUser(@RequestBody CreateUserRequest request) {
        return adminUserService.createUser(request, jwt.getTenantId());
    }

    // ✅ Update user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return adminUserService.updateUser(id, request, jwt.getTenantId());
    }

    // ✅ Deactivate user
    @DeleteMapping("/{id}")
    public void deactivateUser(@PathVariable Long id) {
        adminUserService.deactivateUser(id, jwt.getTenantId());
    }

}

