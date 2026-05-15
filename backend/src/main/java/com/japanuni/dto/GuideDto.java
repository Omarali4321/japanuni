package com.japanuni.dto;

import com.japanuni.entity.AdmissionGuide;
import com.japanuni.entity.StudentLifeArticle;
import com.japanuni.entity.VisaGuide;

public class GuideDto {
    private Long id;
    private String title;
    private String content;
    private String category;
    private String visaType;
    private String imageUrl;

    public static GuideDto fromAdmission(AdmissionGuide g) {
        GuideDto dto = new GuideDto();
        dto.id = g.getId();
        dto.title = g.getTitle();
        dto.content = g.getContent();
        dto.category = g.getCategory();
        return dto;
    }

    public static GuideDto fromVisa(VisaGuide g) {
        GuideDto dto = new GuideDto();
        dto.id = g.getId();
        dto.title = g.getTitle();
        dto.content = g.getContent();
        dto.visaType = g.getVisaType();
        return dto;
    }

    public static GuideDto fromStudentLife(StudentLifeArticle a) {
        GuideDto dto = new GuideDto();
        dto.id = a.getId();
        dto.title = a.getTitle();
        dto.content = a.getContent();
        dto.category = a.getCategory();
        dto.imageUrl = a.getImageUrl();
        return dto;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getCategory() { return category; }
    public String getVisaType() { return visaType; }
    public String getImageUrl() { return imageUrl; }
}
