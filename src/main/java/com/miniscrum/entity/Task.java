package com.miniscrum.entity;

import com.miniscrum.enums.Priority;
import com.miniscrum.enums.TaskStatus;
import jakarta.persistence.*;

/**
 * Une tâche technique appartenant à une User Story.
 * Elle peut être assignée à un développeur.
 */
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;          // TODO | IN_PROGRESS | DONE

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;  // valeur par défaut

    private Integer estimatedHours;

    // Relation : plusieurs tâches peuvent être assignées au même utilisateur
    @ManyToOne
    @JoinColumn(name = "assigned_to")   // colonne de clé étrangère dans la table tasks
    private User assignedTo;

    // Relation : une tâche appartient à une seule User Story
    @ManyToOne
    @JoinColumn(name = "user_story_id")
    private UserStory userStory;

    // ── Constructeurs ──────────────────────────────────────────────────────────

    public Task() {}

    public Task(String title, String description, TaskStatus status, Priority priority,
                User assignedTo, UserStory userStory) {
        this.title         = title;
        this.description   = description;
        this.status        = status;
        this.priority      = priority;
        this.assignedTo    = assignedTo;
        this.userStory     = userStory;
    }

    // ── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId()                      { return id; }
    public String getTitle()                 { return title; }
    public void setTitle(String v)           { this.title = v; }
    public String getDescription()           { return description; }
    public void setDescription(String v)     { this.description = v; }
    public TaskStatus getStatus()            { return status; }
    public void setStatus(TaskStatus v)      { this.status = v; }
    public Priority getPriority()            { return priority; }
    public void setPriority(Priority v)      { this.priority = v; }
    public Integer getEstimatedHours()       { return estimatedHours; }
    public void setEstimatedHours(Integer v) { this.estimatedHours = v; }
    public User getAssignedTo()              { return assignedTo; }
    public void setAssignedTo(User v)        { this.assignedTo = v; }
    public UserStory getUserStory()          { return userStory; }
    public void setUserStory(UserStory v)    { this.userStory = v; }
}
