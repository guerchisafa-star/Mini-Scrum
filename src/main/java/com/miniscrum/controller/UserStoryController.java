package com.miniscrum.controller;

import com.miniscrum.dto.UserStoryRequest;
import com.miniscrum.dto.UserStoryResponse;
import com.miniscrum.service.UserStoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/stories")
@RequiredArgsConstructor
public class UserStoryController {

    private final UserStoryService userStoryService;

    @GetMapping
    public ResponseEntity<List<UserStoryResponse>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(userStoryService.getByProject(projectId));
    }

    @GetMapping("/backlog")
    public ResponseEntity<List<UserStoryResponse>> getBacklog(@PathVariable Long projectId) {
        return ResponseEntity.ok(userStoryService.getBacklog(projectId));
    }

    @PostMapping
    public ResponseEntity<UserStoryResponse> create(
            @PathVariable Long projectId,
            @Valid @RequestBody UserStoryRequest req) {
        return ResponseEntity.ok(userStoryService.create(projectId, req));
    }

    @PutMapping("/{storyId}")
    public ResponseEntity<UserStoryResponse> update(
            @PathVariable Long storyId,
            @Valid @RequestBody UserStoryRequest req) {
        return ResponseEntity.ok(userStoryService.update(storyId, req));
    }

    @PatchMapping("/{storyId}/assign-sprint")
    public ResponseEntity<UserStoryResponse> assignToSprint(
            @PathVariable Long storyId,
            @RequestParam Long sprintId) {
        return ResponseEntity.ok(userStoryService.assignToSprint(storyId, sprintId));
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<Void> delete(@PathVariable Long storyId) {
        userStoryService.delete(storyId);
        return ResponseEntity.noContent().build();
    }
}
