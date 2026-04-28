package com.miniscrum.controller;

import com.miniscrum.dto.DashboardResponse;
import com.miniscrum.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> get(@RequestParam Long userId, @RequestParam String role) {
        return ResponseEntity.ok(dashboardService.getForUser(userId, role));
    }
}
