package com.project.smartmeetingroom.dto;

public class LoginResponse {

    private Long userId;
    private String email;
    private String role;
    private Long tenantId;
    private String token;

    // ✅ Constructor aligned with AuthService
    public LoginResponse(
            Long userId,
            String email,
            String role,
            Long tenantId,
            String token
    ) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.tenantId = tenantId;
        this.token = token;
    }

    // ---------- Getters ----------
    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public String getToken() {
        return token;
    }
}
