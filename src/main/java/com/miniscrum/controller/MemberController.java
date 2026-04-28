package com.miniscrum.controller;

import com.miniscrum.dto.MemberRequest;
import com.miniscrum.dto.MemberResponse;
import com.miniscrum.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
@RequiredArgsConstructor
public class MemberController {

    private final ProjectMemberService memberService;

    @GetMapping
    public ResponseEntity<List<MemberResponse>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(memberService.getByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<MemberResponse> add(@PathVariable Long projectId, @RequestBody MemberRequest req) {
        return ResponseEntity.ok(memberService.add(projectId, req));
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> remove(@PathVariable Long projectId, @PathVariable Long memberId) {
        memberService.remove(memberId);
        return ResponseEntity.noContent().build();
    }
}
