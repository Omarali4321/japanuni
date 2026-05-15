package com.japanuni.controller;

import com.japanuni.dto.CityDto;
import com.japanuni.service.GuideService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final GuideService guideService;

    public CityController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    public ResponseEntity<List<CityDto>> list() {
        return ResponseEntity.ok(guideService.getCities());
    }
}
