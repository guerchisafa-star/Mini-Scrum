package com.miniscrum.repository;

import com.miniscrum.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserStoryId(Long userStoryId);
    List<Task> findByAssignedToId(Long userId);
//requete personnalise(ecrit avec JPQL )
    @Query("SELECT t FROM Task t WHERE t.userStory.sprint.id = :sprintId")
    List<Task> findBySprintId(@Param("sprintId") Long sprintId);
}
