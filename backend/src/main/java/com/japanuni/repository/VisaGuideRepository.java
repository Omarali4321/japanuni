package com.japanuni.repository;

import com.japanuni.entity.VisaGuide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisaGuideRepository extends JpaRepository<VisaGuide, Long> {
    List<VisaGuide> findAllByOrderBySortOrderAsc();
}
