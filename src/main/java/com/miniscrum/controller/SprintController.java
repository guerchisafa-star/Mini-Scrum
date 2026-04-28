package com.miniscrum.controller;

import com.miniscrum.dto.SprintRequest;
import com.miniscrum.dto.SprintResponse;
import com.miniscrum.service.SprintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/sprints")
@RequiredArgsConstructor
public class SprintController {

    private final SprintService sprintService;

    @GetMapping
    public ResponseEntity<List<SprintResponse>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(sprintService.getByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<SprintResponse> create(@PathVariable Long projectId, @Valid @RequestBody SprintRequest req) {
        return ResponseEntity.ok(sprintService.create(projectId, req));
    }

    @PatchMapping("/{sprintId}/start")
    public ResponseEntity<SprintResponse> start(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.start(sprintId));
    }

    @PatchMapping("/{sprintId}/complete")
    public ResponseEntity<SprintResponse> complete(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.complete(sprintId));
    }

    @DeleteMapping("/{sprintId}")
    public ResponseEntity<Void> delete(@PathVariable Long sprintId) {
        sprintService.delete(sprintId);
        return ResponseEntity.noContent().build();
    }
}
