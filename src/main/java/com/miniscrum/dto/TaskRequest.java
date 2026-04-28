package com.miniscrum.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    private String description;

    // Accept both "assignedToId" and "assigneeId" from frontend
    @JsonAlias("assigneeId")
    private Long assignedToId;
}
