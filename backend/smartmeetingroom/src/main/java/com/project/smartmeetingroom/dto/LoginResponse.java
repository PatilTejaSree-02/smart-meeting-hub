package com.project.smartmeetingroom.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private String role;
    private Long tenantId;

    public LoginResponse(
        String token,
        Long userId,
        String email,
        String role,
        Long tenantId
    ) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.tenantId = tenantId;
    }
    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Long getTenantId() { return tenantId; }
}
