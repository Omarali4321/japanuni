package com.japanuni.controller;

import com.japanuni.dto.UniversityDto;
import com.japanuni.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<UniversityDto>> list(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(favoriteService.getFavorites(user.getUsername()));
    }

    @PostMapping("/{universityId}")
    public ResponseEntity<Map<String, String>> add(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long universityId) {
        favoriteService.addFavorite(user.getUsername(), universityId);
        return ResponseEntity.ok(Map.of("message", "Added to favorites"));
    }

    @DeleteMapping("/{universityId}")
    public ResponseEntity<Map<String, String>> remove(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long universityId) {
        favoriteService.removeFavorite(user.getUsername(), universityId);
        return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
    }
}
