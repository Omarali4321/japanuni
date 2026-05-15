package com.japanuni.repository;

import com.japanuni.entity.StudentLifeArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentLifeArticleRepository extends JpaRepository<StudentLifeArticle, Long> {
    List<StudentLifeArticle> findAllByOrderBySortOrderAsc();
}
