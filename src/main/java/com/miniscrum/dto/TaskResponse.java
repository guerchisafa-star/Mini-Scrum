package com.miniscrum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private Long userStoryId;
    private String userStoryTitle;
    private Long assignedToId;
    private String assignedToName;
}
