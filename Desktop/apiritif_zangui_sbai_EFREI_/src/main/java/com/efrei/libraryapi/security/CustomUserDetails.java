package com.efrei.libraryapi.security;

import com.efrei.libraryapi.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convertir les rôles de l'utilisateur en authorities
        return Collections.singletonList(() -> user.getRoles().toString());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // Vous pouvez personnaliser cette logique si nécessaire
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // Idem ici
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // Idem ici
    }

    @Override
    public boolean isEnabled() {
        return true;  // Idem ici
    }
}
