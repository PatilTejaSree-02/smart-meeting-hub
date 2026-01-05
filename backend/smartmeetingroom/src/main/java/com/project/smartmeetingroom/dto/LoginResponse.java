package com.project.smartmeetingroom.dto;

import com.project.smartmeetingroom.entity.User;

public record LoginResponse(
    String token,
    User user
) {}
