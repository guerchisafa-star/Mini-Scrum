package com.miniscrum.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    // Le créateur du projet
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // Liste des membres du projet
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMember> members = new ArrayList<>();

    // Liste des sprints du projet
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sprint> sprints = new ArrayList<>();

    // ── Constructeurs ──────────────────────────────────────────────────────────

    public Project() {}

    public Project(String name, String description, User owner) {
        this.name        = name;
        this.description = description;
        this.owner       = owner;
    }

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()                        { return id; }
    public String getName()                    { return name; }
    public void setName(String v)              { this.name = v; }
    public String getDescription()             { return description; }
    public void setDescription(String v)       { this.description = v; }
    public User getOwner()                     { return owner; }
    public void setOwner(User v)               { this.owner = v; }
    public List<ProjectMember> getMembers()    { return members; }
    public List<Sprint> getSprints()           { return sprints; }
}
