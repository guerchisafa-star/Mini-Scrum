package com.miniscrum.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private String role;
    // dev stats
    private long todo;
    private long inProgress;
    private long done;
    private List<TaskResponse> myTasks;
    // admin stats
    private long totalTodo;
    private long totalInProgress;
    private long totalDone;
    private long totalTasks;
    private long totalProjects;
    private long totalSprints;
    private long activeSprints;
}
