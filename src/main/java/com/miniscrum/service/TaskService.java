package com.miniscrum.service;

import com.miniscrum.dto.TaskRequest;
import com.miniscrum.dto.TaskResponse;
import com.miniscrum.entity.Task;
import com.miniscrum.entity.User;
import com.miniscrum.entity.UserStory;
import com.miniscrum.enums.Priority;
import com.miniscrum.enums.TaskStatus;
import com.miniscrum.repository.TaskRepository;
import com.miniscrum.repository.UserRepository;
import com.miniscrum.repository.UserStoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service de gestion des tâches.
 * Une tâche appartient à une User Story et peut être assignée à un développeur.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserStoryRepository userStoryRepository;
    private final UserRepository userRepository;

    /** Retourne les tâches d'une User Story. */
    public List<TaskResponse> getByStory(Long storyId) {
        return taskRepository.findByUserStoryId(storyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Retourne les tâches d'un sprint (via les stories du sprint). */
    public List<TaskResponse> getBySprint(Long sprintId) {
        return taskRepository.findBySprintId(sprintId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Retourne les tâches assignées à un utilisateur. */
    public List<TaskResponse> getByUser(Long userId) {
        return taskRepository.findByAssignedToId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Retourne une tâche par son ID. */
    public TaskResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    /** Crée une tâche dans une User Story. */
    public TaskResponse create(Long storyId, TaskRequest req) {
        UserStory story = userStoryRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("User story introuvable"));

        // L'assigné est optionnel
        User assignee = null;
        if (req.getAssignedToId() != null) {
            assignee = userRepository.findById(req.getAssignedToId()).orElse(null);
        }

        Task task = new Task(
                req.getTitle(),
                req.getDescription(),
                TaskStatus.TODO,        // statut initial
                Priority.MEDIUM,        // priorité par défaut
                assignee,
                story
        );
        return toResponse(taskRepository.save(task));
    }

    /** Met à jour le titre, la description et l'assigné d'une tâche. */
    public TaskResponse update(Long id, TaskRequest req) {
        Task task = findOrThrow(id);
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());

        if (req.getAssignedToId() != null) {
            task.setAssignedTo(userRepository.findById(req.getAssignedToId()).orElse(null));
        }
        return toResponse(taskRepository.save(task));
    }

    /** Change le statut d'une tâche (TODO → IN_PROGRESS → DONE). */
    public TaskResponse updateStatus(Long id, String status) {
        Task task = findOrThrow(id);
        task.setStatus(TaskStatus.valueOf(status));
        return toResponse(taskRepository.save(task));
    }

    /** Supprime une tâche. */
    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    // ── Méthodes privées ───────────────────────────────────────────────────────

    private Task findOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche introuvable"));
    }

    private TaskResponse toResponse(Task t) {
        Long storyId      = t.getUserStory() != null ? t.getUserStory().getId()    : null;
        String storyTitle = t.getUserStory() != null ? t.getUserStory().getTitle() : null;
        Long assigneeId   = t.getAssignedTo() != null ? t.getAssignedTo().getId()       : null;
        String assigneeName = t.getAssignedTo() != null ? t.getAssignedTo().getFullName() : null;

        return new TaskResponse(
                t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus().name(),
                storyId, storyTitle,
                assigneeId, assigneeName
        );
    }
}
