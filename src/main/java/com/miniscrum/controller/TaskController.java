package com.miniscrum.controller;

import com.miniscrum.dto.TaskRequest;
import com.miniscrum.dto.TaskResponse;
import com.miniscrum.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/stories/{storyId}/tasks")
    public ResponseEntity<List<TaskResponse>> getByStory(@PathVariable Long storyId) {
        return ResponseEntity.ok(taskService.getByStory(storyId));
    }

    @GetMapping("/sprints/{sprintId}/tasks")
    public ResponseEntity<List<TaskResponse>> getBySprint(@PathVariable Long sprintId) {
        return ResponseEntity.ok(taskService.getBySprint(sprintId));
    }

    @GetMapping("/users/{userId}/tasks")
    public ResponseEntity<List<TaskResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getByUser(userId));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PostMapping("/stories/{storyId}/tasks")
    public ResponseEntity<TaskResponse> create(@PathVariable Long storyId, @Valid @RequestBody TaskRequest req) {
        return ResponseEntity.ok(taskService.create(storyId, req));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id, @Valid @RequestBody TaskRequest req) {
        return ResponseEntity.ok(taskService.update(id, req));
    }

    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(taskService.updateStatus(id, status));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
