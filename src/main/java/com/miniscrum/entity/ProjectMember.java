package com.miniscrum.entity;

import com.miniscrum.enums.Role;
import jakarta.persistence.*;


@Entity
@Table(name = "project_members")
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ── Constructeurs ──────────────────────────────────────────────────────────

    public ProjectMember() {}

    public ProjectMember(User user, Project project, Role role) {
        this.user    = user;
        this.project = project;
        this.role    = role;
    }

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()             { return id; }
    public User getUser()           { return user; }
    public void setUser(User v)     { this.user = v; }
    public Project getProject()     { return project; }
    public void setProject(Project v) { this.project = v; }
    public Role getRole()           { return role; }
    public void setRole(Role v)     { this.role = v; }
}
