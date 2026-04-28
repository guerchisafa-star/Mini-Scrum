package com.miniscrum.entity;

import com.miniscrum.enums.Role;
import jakarta.persistence.*;

/**
 * Représente un utilisateur de l'application.
 * @Entity  → Spring va créer une table "users" en base de données
 * @Table   → on choisit le nom exact de la table
 */
@Entity
@Table(name = "users")
public class User {

    // Clé primaire auto-incrémentée (1, 2, 3...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)           // colonne obligatoire en base
    private String fullName;

    @Column(nullable = false, unique = true)  // email unique
    private String email;

    @Column(nullable = false)
    private String password;            // stocké hashé (bcrypt)

    @Enumerated(EnumType.STRING)       
    @Column(nullable = false)
    private Role role;

    // ── Constructeurs ──────────────────────────────────────────────────────────

    public User() {}   

    public User(String fullName, String email, String password, Role role) {
        this.fullName = fullName;
        this.email    = email;
        this.password = password;
        this.role     = role;
    }

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public String getFullName()          { return fullName; }
    public void setFullName(String v)    { this.fullName = v; }
    public String getEmail()             { return email; }
    public void setEmail(String v)       { this.email = v; }
    public String getPassword()          { return password; }
    public void setPassword(String v)    { this.password = v; }
    public Role getRole()                { return role; }
    public void setRole(Role v)          { this.role = v; }
}
