package com.japanuni.repository;

import com.japanuni.entity.University;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UniversityRepository extends JpaRepository<University, Long> {

    java.util.Optional<University> findByName(String name);

    @Query("""
            SELECT u FROM University u
            LEFT JOIN FETCH u.city
            WHERE (:search IS NULL OR :search = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(u.description) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:cityId IS NULL OR u.city.id = :cityId)
            AND (:maxTuition IS NULL OR u.tuitionFeeYearly <= :maxTuition)
            AND (:minRanking IS NULL OR u.ranking >= :minRanking)
            """)
    Page<University> searchUniversities(
            @Param("search") String search,
            @Param("cityId") Long cityId,
            @Param("maxTuition") java.math.BigDecimal maxTuition,
            @Param("minRanking") Integer minRanking,
            Pageable pageable);

    @Query("SELECT u FROM University u LEFT JOIN FETCH u.city LEFT JOIN FETCH u.scholarships WHERE u.id IN :ids")
    List<University> findAllByIdWithDetails(@Param("ids") List<Long> ids);
}
