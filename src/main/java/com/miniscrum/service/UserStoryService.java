package com.miniscrum.service;

import com.miniscrum.dto.UserStoryRequest;
import com.miniscrum.dto.UserStoryResponse;
import com.miniscrum.entity.Project;
import com.miniscrum.entity.Sprint;
import com.miniscrum.entity.UserStory;
import com.miniscrum.enums.Priority;
import com.miniscrum.enums.UserStoryStatus;
import com.miniscrum.repository.ProjectRepository;
import com.miniscrum.repository.SprintRepository;
import com.miniscrum.repository.UserStoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UserStoryService {
//acces base de donner injection des dépendances
    private final UserStoryRepository userStoryRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;

    // récupérer toutes les user stories d’un projet
    public List<UserStoryResponse> getByProject(Long projectId) {
        return userStoryRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

// récupérer le backlog user stories
    public List<UserStoryResponse> getBacklog(Long projectId) {
        return userStoryRepository.findByProjectIdAndSprintIsNull(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

//recuperer les user story d'un sprint
    public List<UserStoryResponse> getBySprint(Long sprintId) {
        return userStoryRepository.findBySprintId(sprintId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

//creer un user story
    public UserStoryResponse create(Long projectId, UserStoryRequest req) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));


        Sprint sprint = null;
        if (req.getSprintId() != null) {
            sprint = sprintRepository.findById(req.getSprintId()).orElse(null);
        }

        UserStory story = new UserStory(
                req.getTitle(),
                req.getDescription(),
                Priority.valueOf(req.getPriority()),
                UserStoryStatus.NOT_PLANNED,
                project,
                sprint
        );
        return toResponse(userStoryRepository.save(story));
    }

//modifier un user story
    public UserStoryResponse update(Long id, UserStoryRequest req) {
        UserStory story = findOrThrow(id);
        story.setTitle(req.getTitle());
        story.setDescription(req.getDescription());
        story.setPriority(Priority.valueOf(req.getPriority()));
        return toResponse(userStoryRepository.save(story));
    }

//assigner une user story a un sprint
    public UserStoryResponse assignToSprint(Long storyId, Long sprintId) {
        UserStory story = findOrThrow(storyId);
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint introuvable"));

        story.setSprint(sprint);
        story.setStatus(UserStoryStatus.PLANNED);
        return toResponse(userStoryRepository.save(story));
    }

//supprimer une user story
    public void delete(Long id) {
        userStoryRepository.deleteById(id);
    }


//chercher user story
    private UserStory findOrThrow(Long id) {
        return userStoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User story introuvable"));
    }
//convertir entity -->dto(pour etre consommer en securiter d'apre le frontend)
    private UserStoryResponse toResponse(UserStory s) {
        Long sprintId     = s.getSprint() != null ? s.getSprint().getId()   : null;
        String sprintName = s.getSprint() != null ? s.getSprint().getName() : null;
        Long projectId    = s.getProject() != null ? s.getProject().getId() : null;
//construire reponse
        return new UserStoryResponse(
                s.getId(), s.getTitle(), s.getDescription(),
                s.getPriority().name(), s.getStatus().name(), s.getStoryPoints(),
                projectId, sprintId, sprintName
        );
    }
}
