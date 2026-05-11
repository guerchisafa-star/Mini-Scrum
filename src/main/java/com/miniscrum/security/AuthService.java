package com.miniscrum.security;

import com.miniscrum.entity.User;
import com.miniscrum.enums.Role;
import com.miniscrum.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!hashPassword(request.getPassword()).equals(user.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        String token = jwtUtil.generate(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name(), token);
    }

    public AuthResponse register(RegisterRequest request) {
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

        String token = jwtUtil.generate(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name(), token);
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
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
