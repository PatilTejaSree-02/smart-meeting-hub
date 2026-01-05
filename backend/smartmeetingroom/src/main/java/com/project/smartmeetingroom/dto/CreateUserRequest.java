package com.project.smartmeetingroom.dto;

public class CreateUserRequest {

    private String email;
    private String password;
    private String role;
    private Long tenantId;

    public CreateUserRequest() {}

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public Long getTenantId() { return tenantId; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }
}
