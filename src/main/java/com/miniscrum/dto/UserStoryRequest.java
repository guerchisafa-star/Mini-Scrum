package com.miniscrum.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserStoryRequest {
    @NotBlank
    private String title;
    private String description;
    private String priority = "MEDIUM";
    private Long sprintId;
}
