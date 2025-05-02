    package com.efrei.libraryapi.controller;

    import com.efrei.libraryapi.entity.User;
    import com.efrei.libraryapi.service.UserService;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.web.bind.annotation.*;

    import java.util.Set;

    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {

        private final UserService userService;
        private final AuthenticationManager authenticationManager;

        public AuthController(UserService userService, AuthenticationManager authenticationManager) {
            this.userService = userService;
            this.authenticationManager = authenticationManager;
        }

        // Inscription d'un utilisateur
        @PostMapping("/register")
        public ResponseEntity<User> registerUser(@RequestParam String email, @RequestParam String password, @RequestParam(required = false) Set<String> roles) {
            User newUser = userService.registerUser(email, password, roles);
            return ResponseEntity.ok(newUser);
        }

        // Connexion d'un utilisateur
        @PostMapping("/login")
        public ResponseEntity<String> loginUser(@RequestParam String email, @RequestParam String password) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            return ResponseEntity.ok("Login successful");
        }
    }
