package com.project.smartmeetingroom.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private Long tenantId;
    private String role;
    private String email;

    public LoginResponse(String token, Long userId, Long tenantId, String role, String email) {
        this.token = token;
        this.userId = userId;
        this.tenantId = tenantId;
        this.role = role;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public String getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }
}
