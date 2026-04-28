package com.miniscrum.dto;

import lombok.Data;

@Data
public class MemberRequest {
    private Long userId;
    private String role;
}
