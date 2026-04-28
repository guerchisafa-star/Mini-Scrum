package com.miniscrum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String role;
}
