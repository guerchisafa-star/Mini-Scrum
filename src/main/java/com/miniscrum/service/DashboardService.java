package com.miniscrum.service;

import com.miniscrum.dto.DashboardResponse;
import com.miniscrum.dto.TaskResponse;
import com.miniscrum.enums.SprintStatus;
import com.miniscrum.enums.TaskStatus;
import com.miniscrum.repository.ProjectRepository;
import com.miniscrum.repository.SprintRepository;
import com.miniscrum.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
//accéder a la base de données pour les taches
    private final TaskRepository taskRepository;
    //acces au project
    private final ProjectRepository projectRepository;
    //accés au sprint
    private final SprintRepository sprintRepository;
    //pour les taches
    private final TaskService taskService;
    // Méthode principale pour récupérer les données du dashboard
    public DashboardResponse getForUser(Long userId, String role) {
        // Si l'utilisateur est ADMIN
        if ("ADMIN".equals(role) || "PRODUCT_OWNER".equals(role) || "SCRUM_MASTER".equals(role)) {
            //recuperer touts les taches
            var allTasks = taskRepository.findAll();
            //compter les taches to do
            long totalTodo = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
            //compter les tache en progresse
            long totalInProgress = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
            //compter les taches done
            long totalDone = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
            //compter les taches active
            long activeSprints = sprintRepository.findAll().stream()
                    .filter(s -> s.getStatus() == SprintStatus.ACTIVE).count();
            //pour affichage
            return DashboardResponse.builder()
                    .role(role)
                    .totalTodo(totalTodo).totalInProgress(totalInProgress).totalDone(totalDone)
                    .totalTasks(allTasks.size())
                    .totalProjects(projectRepository.count())
                    .totalSprints(sprintRepository.count())
                    .activeSprints(activeSprints)
                    .build();
            //si user est dev
        } else {
            //recuperer ses taches uniquement
            List<TaskResponse> myTasks = taskService.getByUser(userId);
            //compter ses tache to do
            long todo = myTasks.stream().filter(t -> "TODO".equals(t.getStatus())).count();
            // compter ses tache en progress
            long inProgress = myTasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count();
            // compter ses taches done
            long done = myTasks.stream().filter(t -> "DONE".equals(t.getStatus())).count();
            //pour affichage
            return DashboardResponse.builder()
                    .role(role)
                    .todo(todo).inProgress(inProgress).done(done)
                    .myTasks(myTasks)
                    .build();
        }
    }
}
