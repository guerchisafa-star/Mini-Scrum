package com.miniscrum.security;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// Toutes les routes commencent par /api/auth
@RequestMapping("/api/auth")
public class AuthController {
    //injection de service
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login 
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        return ResponseEntity.ok(authService.login(request, session));
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request, HttpSession session) {
        return ResponseEntity.ok(authService.register(request, session));
    }

    // Logout 
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok().build();
    }

    // Vérifier si l'utilisateur est connecté (session active)
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Non connecté");
        }
        return ResponseEntity.ok(new AuthResponse(
                userId,
                null,
                (String) session.getAttribute("userEmail"),
                (String) session.getAttribute("userRole")
        ));
    }
}
