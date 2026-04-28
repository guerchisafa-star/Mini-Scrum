package com.miniscrum.security;

import com.miniscrum.entity.User;
import com.miniscrum.enums.Role;
import com.miniscrum.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Login : vérifie email + mot de passe
    public AuthResponse login(LoginRequest request, HttpSession session) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!hashPassword(request.getPassword()).equals(user.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        session.setAttribute("userId",    user.getId());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userRole",  user.getRole().name());

        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }

    // Register : crée un nouvel utilisateur
    public AuthResponse register(RegisterRequest request, HttpSession session) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Role role = (request.getRole() == null) ? Role.DEVELOPER : parseRole(request.getRole());

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                hashPassword(request.getPassword()),
                role
        );
        user = userRepository.save(user);

        session.setAttribute("userId",    user.getId());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userRole",  user.getRole().name());

        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }

    // Logout : détruit la session
    public void logout(HttpSession session) {
        session.invalidate();
    }

    // Hash SHA-256 simple (sans Spring Security)
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erreur de hashage");
        }
    }

    private Role parseRole(String roleStr) {
        return switch (roleStr.toUpperCase()) {
            case "ADMIN"         -> Role.ADMIN;
            case "PRODUCT_OWNER" -> Role.PRODUCT_OWNER;
            case "SCRUM_MASTER"  -> Role.SCRUM_MASTER;
            default              -> Role.DEVELOPER;
        };
    }
}
