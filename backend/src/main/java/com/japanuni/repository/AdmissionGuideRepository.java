package com.japanuni.repository;

import com.japanuni.entity.AdmissionGuide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdmissionGuideRepository extends JpaRepository<AdmissionGuide, Long> {
    List<AdmissionGuide> findAllByOrderBySortOrderAsc();
}
