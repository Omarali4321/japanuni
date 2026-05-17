package com.japanuni.service;

import com.japanuni.dto.MatchRequest;
import com.japanuni.dto.MatchResultDto;
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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

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

    @Transactional(readOnly = true)
    public List<MatchResultDto> match(MatchRequest request, Long userId) {
        String field = normalize(request.getField());
        String jlptLevel = normalize(request.getJlptLevel());

        return universityRepository.findAll().stream()
                .map(u -> scoreUniversity(u, request, field, jlptLevel, userId))
                .sorted(Comparator.comparingInt(MatchResultDto::getScore).reversed()
                        .thenComparing(result -> result.getUniversity().getRanking(), Comparator.nullsLast(Integer::compareTo)))
                .limit(5)
                .toList();
    }

    private MatchResultDto scoreUniversity(University u, MatchRequest request, String field, String jlptLevel, Long userId) {
        int score = 35;
        List<String> reasons = new ArrayList<>();
        List<String> gaps = new ArrayList<>();

        if (request.getBudgetYearly() != null && u.getTuitionFeeYearly() != null) {
            if (request.getBudgetYearly().compareTo(u.getTuitionFeeYearly()) >= 0) {
                score += 20;
                reasons.add("Tuition fits your yearly budget.");
            } else {
                score -= 18;
                gaps.add("Tuition is above your yearly budget.");
            }
        }

        if (request.getIeltsScore() != null && u.getIeltsRequirement() != null) {
            if (request.getIeltsScore() >= u.getIeltsRequirement()) {
                score += 18;
                reasons.add("Your IELTS score meets the listed requirement.");
            } else if (request.getIeltsScore() + 0.5 >= u.getIeltsRequirement()) {
                score += 4;
                gaps.add("IELTS is close, but you may need a slightly higher score.");
            } else {
                score -= 14;
                gaps.add("IELTS is below the listed requirement.");
            }
        }

        if (!field.isBlank()) {
            String programs = normalize(u.getPrograms());
            if (programs.contains(field) || fieldMatchesPrograms(field, programs)) {
                score += 22;
                reasons.add("Programs are related to your study interest.");
            } else {
                score -= 6;
                gaps.add("Programs may not directly match your study interest.");
            }
        }

        if (!jlptLevel.isBlank() && u.getJlptRequirement() != null) {
            int studentJlpt = jlptRank(jlptLevel);
            int requiredJlpt = jlptRank(u.getJlptRequirement());
            if (studentJlpt > 0 && requiredJlpt > 0 && studentJlpt <= requiredJlpt) {
                score += 10;
                reasons.add("Your JLPT level meets the listed requirement.");
            } else {
                score -= 6;
                gaps.add("JLPT may need improvement for Japanese-taught programs.");
            }
        }

        if (request.getCityId() != null && u.getCity() != null) {
            if (request.getCityId().equals(u.getCity().getId())) {
                score += 8;
                reasons.add("Located in your preferred city.");
            } else {
                score -= 2;
            }
        }

        if (u.getRanking() != null && u.getRanking() <= 70) {
            score += 6;
            reasons.add("Strong ranking among listed universities.");
        }

        score = Math.max(0, Math.min(100, score));
        String fitLevel = score >= 78 ? "Excellent fit" : score >= 60 ? "Good fit" : score >= 42 ? "Possible fit" : "Stretch option";
        return new MatchResultDto(UniversityDto.from(u, userId != null &&
                favoriteRepository.existsByUserIdAndUniversityId(userId, u.getId()), null, null), score, fitLevel, reasons, gaps);
    }

    private boolean fieldMatchesPrograms(String field, String programs) {
        if (field.contains("computer") || field.contains("software") || field.contains("it")) {
            return programs.contains("computer") || programs.contains("engineering") || programs.contains("science");
        }
        if (field.contains("business") || field.contains("management")) {
            return programs.contains("business") || programs.contains("commerce") || programs.contains("economics");
        }
        if (field.contains("medicine") || field.contains("medical")) {
            return programs.contains("medicine") || programs.contains("dentistry") || programs.contains("life science");
        }
        return false;
    }

    private int jlptRank(String level) {
        return switch (normalize(level)) {
            case "n1" -> 1;
            case "n2" -> 2;
            case "n3" -> 3;
            case "n4" -> 4;
            case "n5" -> 5;
            default -> 0;
        };
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private UniversityDto toDto(University u, Long userId) {
        boolean favorited = userId != null && favoriteRepository.existsByUserIdAndUniversityId(userId, u.getId());
        var reviews = reviewRepository.findByUniversityIdOrderByCreatedAtDesc(u.getId());
        Double avg = reviews.isEmpty() ? null :
                reviews.stream().mapToInt(r -> r.getRating()).average().orElse(0);
        return UniversityDto.from(u, favorited, avg, (long) reviews.size());
    }
}
