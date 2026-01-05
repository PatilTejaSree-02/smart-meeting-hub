package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.CreateUserRequest;
import com.project.smartmeetingroom.dto.UpdateUserRequest;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    // LIST USERS
    @GetMapping
    public List<User> getUsers(@RequestParam Long tenantId) {
        return adminUserService.getUsers(tenantId);
    }

    // CREATE USER
    @PostMapping
    public User createUser(@RequestBody CreateUserRequest request) {
        return adminUserService.createUser(request);
    }

    // UPDATE USER
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        return adminUserService.updateUser(id, request);
    }

    // DEACTIVATE USER
    @DeleteMapping("/{id}")
    public void deactivateUser(@PathVariable Long id) {
        adminUserService.deactivateUser(id);
    }
}
