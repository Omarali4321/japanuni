package com.japanuni.service;

import com.japanuni.dto.AdminStatsDto;
import com.japanuni.repository.*;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;

    public AdminService(UserRepository userRepository, UniversityRepository universityRepository,
                        ScholarshipRepository scholarshipRepository, ReviewRepository reviewRepository,
                        FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.universityRepository = universityRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.reviewRepository = reviewRepository;
        this.favoriteRepository = favoriteRepository;
    }

    public AdminStatsDto getStats() {
        return new AdminStatsDto(
                userRepository.count(),
                universityRepository.count(),
                scholarshipRepository.count(),
                reviewRepository.count(),
                favoriteRepository.count()
        );
    }
}
