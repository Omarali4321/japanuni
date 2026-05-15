package com.japanuni.service;

import com.japanuni.dto.CityDto;
import com.japanuni.dto.GuideDto;
import com.japanuni.repository.AdmissionGuideRepository;
import com.japanuni.repository.CityRepository;
import com.japanuni.repository.StudentLifeArticleRepository;
import com.japanuni.repository.VisaGuideRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuideService {

    private final AdmissionGuideRepository admissionGuideRepository;
    private final VisaGuideRepository visaGuideRepository;
    private final StudentLifeArticleRepository studentLifeArticleRepository;
    private final CityRepository cityRepository;

    public GuideService(AdmissionGuideRepository admissionGuideRepository, VisaGuideRepository visaGuideRepository,
                        StudentLifeArticleRepository studentLifeArticleRepository, CityRepository cityRepository) {
        this.admissionGuideRepository = admissionGuideRepository;
        this.visaGuideRepository = visaGuideRepository;
        this.studentLifeArticleRepository = studentLifeArticleRepository;
        this.cityRepository = cityRepository;
    }

    public List<GuideDto> getAdmissionGuides() {
        return admissionGuideRepository.findAllByOrderBySortOrderAsc()
                .stream().map(GuideDto::fromAdmission).toList();
    }

    public List<GuideDto> getVisaGuides() {
        return visaGuideRepository.findAllByOrderBySortOrderAsc()
                .stream().map(GuideDto::fromVisa).toList();
    }

    public List<GuideDto> getStudentLifeArticles() {
        return studentLifeArticleRepository.findAllByOrderBySortOrderAsc()
                .stream().map(GuideDto::fromStudentLife).toList();
    }

    public List<CityDto> getCities() {
        return cityRepository.findAll().stream().map(CityDto::from).toList();
    }
}
