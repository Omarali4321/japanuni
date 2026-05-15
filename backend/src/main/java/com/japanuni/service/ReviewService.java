package com.japanuni.service;

import com.japanuni.dto.CreateReviewRequest;
import com.japanuni.dto.ReviewDto;
import com.japanuni.entity.Review;
import com.japanuni.entity.University;
import com.japanuni.entity.User;
import com.japanuni.exception.ResourceNotFoundException;
import com.japanuni.repository.ReviewRepository;
import com.japanuni.repository.UniversityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UniversityRepository universityRepository;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepository, UniversityRepository universityRepository,
                         UserService userService) {
        this.reviewRepository = reviewRepository;
        this.universityRepository = universityRepository;
        this.userService = userService;
    }

    public List<ReviewDto> getByUniversity(Long universityId) {
        return reviewRepository.findByUniversityIdOrderByCreatedAtDesc(universityId)
                .stream().map(ReviewDto::from).toList();
    }

    @Transactional
    public ReviewDto create(String email, Long universityId, CreateReviewRequest request) {
        User user = userService.findByEmail(email);
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        Review review = new Review();
        review.setUser(user);
        review.setUniversity(university);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return ReviewDto.from(reviewRepository.save(review));
    }
}
