package com.miniscrum.service;

import com.miniscrum.dto.SprintRequest;
import com.miniscrum.dto.SprintResponse;
import com.miniscrum.entity.Project;
import com.miniscrum.entity.Sprint;
import com.miniscrum.enums.SprintStatus;
import com.miniscrum.repository.ProjectRepository;
import com.miniscrum.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service de gestion des sprints.
 * Un sprint passe par 3 états : PLANNED → ACTIVE → COMPLETED.
 */
@Service
@RequiredArgsConstructor
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    /** Retourne tous les sprints d'un projet. */
    public List<SprintResponse> getByProject(Long projectId) {
        return sprintRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Crée un sprint dans un projet (statut initial : PLANNED). */
    public SprintResponse create(Long projectId, SprintRequest req) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));

        Sprint sprint = new Sprint(
                req.getName(),
                req.getStartDate(),
                req.getEndDate(),
                SprintStatus.PLANNED,
                project
        );
        return toResponse(sprintRepository.save(sprint));
    }

    /** Démarre un sprint (PLANNED → ACTIVE). */
    public SprintResponse start(Long sprintId) {
        Sprint sprint = findOrThrow(sprintId);
        sprint.setStatus(SprintStatus.ACTIVE);
        return toResponse(sprintRepository.save(sprint));
    }

    /** Termine un sprint (ACTIVE → COMPLETED). */
    public SprintResponse complete(Long sprintId) {
        Sprint sprint = findOrThrow(sprintId);
        sprint.setStatus(SprintStatus.COMPLETED);
        return toResponse(sprintRepository.save(sprint));
    }

    /** Supprime un sprint. */
    public void delete(Long sprintId) {
        sprintRepository.deleteById(sprintId);
    }

    // ── Méthodes privées ───────────────────────────────────────────────────────

    private Sprint findOrThrow(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint introuvable"));
    }

    private SprintResponse toResponse(Sprint s) {
        return new SprintResponse(
                s.getId(), s.getName(), s.getStartDate(), s.getEndDate(),
                s.getStatus().name(), s.getProject().getId()
        );
    }
}
