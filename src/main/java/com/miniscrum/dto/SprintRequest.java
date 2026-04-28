package com.miniscrum.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SprintRequest {
    @NotBlank
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
}
