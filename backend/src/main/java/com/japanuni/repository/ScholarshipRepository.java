package com.japanuni.repository;

import com.japanuni.entity.Scholarship;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {

    @Query("""
            SELECT s FROM Scholarship s
            LEFT JOIN s.university u
            WHERE (:search IS NULL OR :search = '' OR LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:universityId IS NULL OR u.id = :universityId)
            """)
    Page<Scholarship> search(
            @Param("search") String search,
            @Param("universityId") Long universityId,
            Pageable pageable);
}
