package com.miniscrum.entity;

import com.miniscrum.enums.Priority;
import com.miniscrum.enums.UserStoryStatus;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Une User Story = une fonctionnalité décrite du point de vue utilisateur.
 * Elle appartient à un projet et peut être assignée à un sprint.
 */
@Entity
@Table(name = "user_stories")
public class UserStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    private Integer storyPoints;        // estimation en points

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStoryStatus status = UserStoryStatus.NOT_PLANNED;

    // Relation : une story peut appartenir à un sprint (ou rester dans le backlog)
    @ManyToOne
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    // Relation : une story appartient à un projet
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    // Relation : une story peut avoir plusieurs tâches
    // cascade = ALL → si on supprime la story, ses tâches sont supprimées aussi
    @OneToMany(mappedBy = "userStory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();

    // ── Constructeurs ──────────────────────────────────────────────────────────

    public UserStory() {}

    public UserStory(String title, String description, Priority priority,
                     UserStoryStatus status, Project project, Sprint sprint) {
        this.title       = title;
        this.description = description;
        this.priority    = priority;
        this.status      = status;
        this.project     = project;
        this.sprint      = sprint;
    }

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()                        { return id; }
    public String getTitle()                   { return title; }
    public void setTitle(String v)             { this.title = v; }
    public String getDescription()             { return description; }
    public void setDescription(String v)       { this.description = v; }
    public Priority getPriority()              { return priority; }
    public void setPriority(Priority v)        { this.priority = v; }
    public Integer getStoryPoints()            { return storyPoints; }
    public void setStoryPoints(Integer v)      { this.storyPoints = v; }
    public UserStoryStatus getStatus()         { return status; }
    public void setStatus(UserStoryStatus v)   { this.status = v; }
    public Sprint getSprint()                  { return sprint; }
    public void setSprint(Sprint v)            { this.sprint = v; }
    public Project getProject()                { return project; }
    public void setProject(Project v)          { this.project = v; }
    public List<Task> getTasks()               { return tasks; }
}
