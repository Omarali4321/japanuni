package com.japanuni.controller;

import com.japanuni.dto.PageResponse;
import com.japanuni.dto.ScholarshipDto;
import com.japanuni.service.ScholarshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ScholarshipDto>> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long universityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(scholarshipService.search(search, universityId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScholarshipDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(scholarshipService.getById(id));
    }
}
