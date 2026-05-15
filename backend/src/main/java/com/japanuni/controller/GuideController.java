package com.japanuni.controller;

import com.japanuni.dto.CityDto;
import com.japanuni.dto.GuideDto;
import com.japanuni.service.GuideService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping("/admission")
    public ResponseEntity<List<GuideDto>> admission() {
        return ResponseEntity.ok(guideService.getAdmissionGuides());
    }

    @GetMapping("/visa")
    public ResponseEntity<List<GuideDto>> visa() {
        return ResponseEntity.ok(guideService.getVisaGuides());
    }

    @GetMapping("/student-life")
    public ResponseEntity<List<GuideDto>> studentLife() {
        return ResponseEntity.ok(guideService.getStudentLifeArticles());
    }
}
