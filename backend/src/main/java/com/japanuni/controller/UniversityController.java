package com.japanuni.controller;

import com.japanuni.dto.CompareRequest;
import com.japanuni.dto.CreateReviewRequest;
import com.japanuni.dto.MatchRequest;
import com.japanuni.dto.MatchResultDto;
import com.japanuni.dto.PageResponse;
import com.japanuni.dto.ReviewDto;
import com.japanuni.dto.UniversityDto;
import com.japanuni.entity.User;
import com.japanuni.service.ReviewService;
import com.japanuni.service.UniversityService;
import com.japanuni.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/universities")
public class UniversityController {

    private final UniversityService universityService;
    private final ReviewService reviewService;
    private final UserService userService;

    public UniversityController(UniversityService universityService, ReviewService reviewService,
                                UserService userService) {
        this.universityService = universityService;
        this.reviewService = reviewService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<UniversityDto>> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) BigDecimal maxTuition,
            @RequestParam(required = false) Integer minRanking,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserDetails authUser) {
        Long userId = resolveUserId(authUser);
        return ResponseEntity.ok(universityService.search(search, cityId, maxTuition, minRanking, page, size, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityDto> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails authUser) {
        return ResponseEntity.ok(universityService.getById(id, resolveUserId(authUser)));
    }

    @PostMapping("/compare")
    public ResponseEntity<List<UniversityDto>> compare(
            @Valid @RequestBody CompareRequest request,
            @AuthenticationPrincipal UserDetails authUser) {
        return ResponseEntity.ok(universityService.compare(request.getUniversityIds(), resolveUserId(authUser)));
    }

    @PostMapping("/match")
    public ResponseEntity<List<MatchResultDto>> match(
            @Valid @RequestBody MatchRequest request,
            @AuthenticationPrincipal UserDetails authUser) {
        return ResponseEntity.ok(universityService.match(request, resolveUserId(authUser)));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getByUniversity(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewDto> createReview(
            @PathVariable Long id,
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(reviewService.create(user.getUsername(), id, request));
    }

    private Long resolveUserId(UserDetails authUser) {
        if (authUser == null) return null;
        User user = userService.findByEmail(authUser.getUsername());
        return user.getId();
    }
}
