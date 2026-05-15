package com.japanuni.service;

import com.japanuni.dto.UniversityDto;
import com.japanuni.entity.Favorite;
import com.japanuni.entity.University;
import com.japanuni.entity.User;
import com.japanuni.exception.BadRequestException;
import com.japanuni.exception.ResourceNotFoundException;
import com.japanuni.repository.FavoriteRepository;
import com.japanuni.repository.UniversityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UniversityRepository universityRepository;
    private final UserService userService;

    public FavoriteService(FavoriteRepository favoriteRepository, UniversityRepository universityRepository,
                           UserService userService) {
        this.favoriteRepository = favoriteRepository;
        this.universityRepository = universityRepository;
        this.userService = userService;
    }

    public List<UniversityDto> getFavorites(String email) {
        User user = userService.findByEmail(email);
        return favoriteRepository.findByUserIdWithUniversity(user.getId()).stream()
                .map(f -> UniversityDto.from(f.getUniversity()))
                .toList();
    }

    @Transactional
    public void addFavorite(String email, Long universityId) {
        User user = userService.findByEmail(email);
        if (favoriteRepository.existsByUserIdAndUniversityId(user.getId(), universityId)) {
            throw new BadRequestException("Already in favorites");
        }
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setUniversity(university);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(String email, Long universityId) {
        User user = userService.findByEmail(email);
        favoriteRepository.deleteByUserIdAndUniversityId(user.getId(), universityId);
    }
}
