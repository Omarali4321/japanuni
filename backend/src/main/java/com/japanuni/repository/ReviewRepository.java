package com.japanuni.repository;

import com.japanuni.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUniversityIdOrderByCreatedAtDesc(Long universityId);
}
