package com.project.smartmeetingroom.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Lightweight UserDetails object created from JWT claims.
 * NO database hit happens here.
 */
public class JwtUserDetails implements UserDetails {

    private final Long userId;
    private final String email;
    private final String role;
    private final Long tenantId;

    public JwtUserDetails(
            Long userId,
            String email,
            String role,
            Long tenantId
    ) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.tenantId = tenantId;
    }

    /* ================= Custom Getters ================= */

    public Long getUserId() {
        return userId;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public String getRole() {
        return role;
    }

    /* ================= Spring Security ================= */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Spring Security expects roles as ROLE_*
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return null; // JWT-based auth → no password here
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
