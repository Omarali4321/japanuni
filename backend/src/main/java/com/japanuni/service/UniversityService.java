package com.japanuni.service;

import com.japanuni.dto.PageResponse;
import com.japanuni.dto.UniversityDto;
import com.japanuni.entity.University;
import com.japanuni.exception.ResourceNotFoundException;
import com.japanuni.repository.FavoriteRepository;
import com.japanuni.repository.ReviewRepository;
import com.japanuni.repository.UniversityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;

    public UniversityService(UniversityRepository universityRepository, FavoriteRepository favoriteRepository,
                             ReviewRepository reviewRepository) {
        this.universityRepository = universityRepository;
        this.favoriteRepository = favoriteRepository;
        this.reviewRepository = reviewRepository;
    }

    public PageResponse<UniversityDto> search(
            String search, Long cityId, BigDecimal maxTuition, Integer minRanking,
            int page, int size, Long userId) {

        Page<University> result = universityRepository.searchUniversities(
                search, cityId, maxTuition, minRanking,
                PageRequest.of(page, size, Sort.by(Sort.Order.asc("ranking").nullsLast())));

        List<UniversityDto> dtos = result.getContent().stream()
                .map(u -> toDto(u, userId))
                .toList();
        return new PageResponse<>(dtos, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public UniversityDto getById(Long id, Long userId) {
        University u = universityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        return toDto(u, userId);
    }

    public List<UniversityDto> compare(List<Long> ids, Long userId) {
        if (ids == null || ids.size() < 2 || ids.size() > 4) {
            throw new com.japanuni.exception.BadRequestException("Provide 2 to 4 university IDs");
        }
        return universityRepository.findAllByIdWithDetails(ids).stream()
                .map(u -> toDto(u, userId))
                .toList();
    }

    private UniversityDto toDto(University u, Long userId) {
        boolean favorited = userId != null && favoriteRepository.existsByUserIdAndUniversityId(userId, u.getId());
        var reviews = reviewRepository.findByUniversityIdOrderByCreatedAtDesc(u.getId());
        Double avg = reviews.isEmpty() ? null :
                reviews.stream().mapToInt(r -> r.getRating()).average().orElse(0);
        return UniversityDto.from(u, favorited, avg, (long) reviews.size());
    }
}
