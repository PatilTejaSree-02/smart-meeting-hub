package com.project.smartmeetingroom.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.CreateUserRequest;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminUserController {

    private final AdminUserService userService;
    private final JwtContextUtil jwt;

    public AdminUserController(
            AdminUserService userService,
            JwtContextUtil jwt) {
        this.userService = userService;
        this.jwt = jwt;
    }

    @GetMapping
    public List<User> users() {
        return userService.getUsers(jwt.getTenantId());
    }

    @PostMapping
    public User create(@RequestBody CreateUserRequest req) {
        req.setTenantId(jwt.getTenantId());
        return userService.createUser(req);
    }
}
