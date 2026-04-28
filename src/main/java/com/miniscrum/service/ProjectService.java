package com.miniscrum.service;

import com.miniscrum.dto.ProjectRequest;
import com.miniscrum.dto.ProjectResponse;
import com.miniscrum.entity.Project;
import com.miniscrum.entity.User;
import com.miniscrum.repository.ProjectRepository;
import com.miniscrum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service de gestion des projets.
 * Contient toute la logique métier (pas de logique dans le controller).
 */
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /** Retourne tous les projets. */
    public List<ProjectResponse> getAll() {
        return projectRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Retourne les projets d'un propriétaire donné. */
    public List<ProjectResponse> getByOwner(Long ownerId) {
        return projectRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Retourne un projet par son ID. */
    public ProjectResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    /** Crée un nouveau projet. */
    public ProjectResponse create(Long ownerId, ProjectRequest req) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Project project = new Project(req.getName(), req.getDescription(), owner);
        return toResponse(projectRepository.save(project));
    }

    /** Met à jour le nom et la description d'un projet. */
    public ProjectResponse update(Long id, ProjectRequest req) {
        Project project = findOrThrow(id);
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        return toResponse(projectRepository.save(project));
    }

    /** Supprime un projet. */
    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    // ── Méthodes privées ───────────────────────────────────────────────────────

    /** Cherche un projet ou lance une erreur si introuvable. */
    private Project findOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));
    }

    /** Convertit une entité Project en DTO ProjectResponse. */
    private ProjectResponse toResponse(Project p) {
        Long ownerId   = p.getOwner() != null ? p.getOwner().getId()       : null;
        String ownerName = p.getOwner() != null ? p.getOwner().getFullName() : null;
        return new ProjectResponse(p.getId(), p.getName(), p.getDescription(), ownerId, ownerName);
    }
}
