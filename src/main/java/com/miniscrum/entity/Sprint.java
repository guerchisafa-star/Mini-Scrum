package com.miniscrum.entity;

import com.miniscrum.enums.SprintStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * Un Sprint = une période de travail (ex: 2 semaines).
 * Il appartient à un projet et contient des User Stories.
 */
@Entity
@Table(name = "sprints")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SprintStatus status;        // PLANNED | ACTIVE | COMPLETED

    // Relation : un sprint appartient à un projet
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // ── Constructeurs ──────────────────────────────────────────────────────────

    public Sprint() {}

    public Sprint(String name, LocalDate startDate, LocalDate endDate,
                  SprintStatus status, Project project) {
        this.name      = name;
        this.startDate = startDate;
        this.endDate   = endDate;
        this.status    = status;
        this.project   = project;
    }

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()                    { return id; }
    public String getName()                { return name; }
    public void setName(String v)          { this.name = v; }
    public LocalDate getStartDate()        { return startDate; }
    public void setStartDate(LocalDate v)  { this.startDate = v; }
    public LocalDate getEndDate()          { return endDate; }
    public void setEndDate(LocalDate v)    { this.endDate = v; }
    public SprintStatus getStatus()        { return status; }
    public void setStatus(SprintStatus v)  { this.status = v; }
    public Project getProject()            { return project; }
    public void setProject(Project v)      { this.project = v; }
}
