package com.japanuni.repository;

import com.japanuni.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query("SELECT f FROM Favorite f JOIN FETCH f.university u LEFT JOIN FETCH u.city WHERE f.user.id = :userId")
    List<Favorite> findByUserIdWithUniversity(@Param("userId") Long userId);

    Optional<Favorite> findByUserIdAndUniversityId(Long userId, Long universityId);

    boolean existsByUserIdAndUniversityId(Long userId, Long universityId);

    void deleteByUserIdAndUniversityId(Long userId, Long universityId);
}
