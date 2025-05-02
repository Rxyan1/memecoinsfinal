package com.efrei.libraryapi.config;

import com.efrei.libraryapi.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final UserService userService;

    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Encode les mots de passe avec BCrypt
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userService)  // UserService implémente UserDetailsService
                .passwordEncoder(passwordEncoder());  // Utilisation de BCrypt pour l'encodage
        return authenticationManagerBuilder.build();  // Construction de l'AuthenticationManager
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Désactive la protection CSRF
                .authorizeHttpRequests()  // Configuration des règles de sécurité
                .requestMatchers("/api/auth/**").permitAll()  // Permet l'accès libre aux routes d'authentification
                .anyRequest().authenticated()  // Toutes les autres requêtes nécessitent une authentification
                .and()
                .httpBasic();  // Utilise la méthode HTTP Basic pour l'authentification
        return http.build();  // Retourne la configuration de sécurité
    }
}
