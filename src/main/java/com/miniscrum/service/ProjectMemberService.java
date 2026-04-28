package com.miniscrum.service;

import com.miniscrum.dto.MemberRequest;
import com.miniscrum.dto.MemberResponse;
import com.miniscrum.entity.Project;
import com.miniscrum.entity.ProjectMember;
import com.miniscrum.entity.User;
import com.miniscrum.enums.Role;
import com.miniscrum.repository.ProjectMemberRepository;
import com.miniscrum.repository.ProjectRepository;
import com.miniscrum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service de gestion des membres d'un projet.
 * Permet d'ajouter ou retirer des utilisateurs d'un projet.
 */
@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final ProjectMemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /** Retourne tous les membres d'un projet. */
    public List<MemberResponse> getByProject(Long projectId) {
        return memberRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Ajoute un utilisateur à un projet avec un rôle. */
    public MemberResponse add(Long projectId, MemberRequest req) {
        // Vérifier que l'utilisateur n'est pas déjà membre
        if (memberRepository.existsByProjectIdAndUserId(projectId, req.getUserId())) {
            throw new RuntimeException("Membre déjà dans le projet");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Rôle DEVELOPER par défaut si non précisé
        Role role = req.getRole() != null ? Role.valueOf(req.getRole()) : Role.DEVELOPER;

        ProjectMember member = new ProjectMember(user, project, role);
        return toResponse(memberRepository.save(member));
    }

    /** Retire un membre d'un projet. */
    public void remove(Long memberId) {
        memberRepository.deleteById(memberId);
    }

    // ── Méthodes privées ───────────────────────────────────────────────────────

    private MemberResponse toResponse(ProjectMember m) {
        return new MemberResponse(
                m.getId(),
                m.getUser().getId(),
                m.getUser().getFullName(),
                m.getUser().getEmail(),
                m.getRole().name()
        );
    }
}
