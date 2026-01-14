package com.project.smartmeetingroom.security;

public class UserPrincipal {

    private final Long userId;
    private final Long tenantId;
    private final String email;

    public UserPrincipal(Long userId, Long tenantId, String email) {
        this.userId = userId;
        this.tenantId = tenantId;
        this.email = email;
    }

    public Long getUserId() { return userId; }
    public Long getTenantId() { return tenantId; }
    public String getEmail() { return email; }
}
