package com.miniscrum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStoryResponse {
    private Long id;
    private String title;
    private String description;
    private String priority;
    private String status;
    private Integer storyPoints;
    private Long projectId;
    private Long sprintId;
    private String sprintName;
}
