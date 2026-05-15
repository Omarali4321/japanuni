package com.japanuni.dto;

import com.japanuni.entity.University;
import java.math.BigDecimal;
import java.util.List;

public class UniversityDto {
    private Long id;
    private String name;
    private String description;
    private Integer ranking;
    private BigDecimal tuitionFeeYearly;
    private Double ieltsRequirement;
    private Integer toeflRequirement;
    private String jlptRequirement;
    private Double acceptanceRate;
    private String programs;
    private String dormitoryInfo;
    private String websiteUrl;
    private List<String> images;
    private String cityName;
    private Long cityId;
    private Integer costOfLivingMonthly;
    private boolean favorited;
    private Double averageRating;
    private Long reviewCount;

    public static UniversityDto from(University u) {
        return from(u, false, null, null);
    }

    public static UniversityDto from(University u, boolean favorited, Double avgRating, Long reviewCount) {
        UniversityDto dto = new UniversityDto();
        dto.id = u.getId();
        dto.name = u.getName();
        dto.description = u.getDescription();
        dto.ranking = u.getRanking();
        dto.tuitionFeeYearly = u.getTuitionFeeYearly();
        dto.ieltsRequirement = u.getIeltsRequirement();
        dto.toeflRequirement = u.getToeflRequirement();
        dto.jlptRequirement = u.getJlptRequirement();
        dto.acceptanceRate = u.getAcceptanceRate();
        dto.programs = u.getPrograms();
        dto.dormitoryInfo = u.getDormitoryInfo();
        dto.websiteUrl = u.getWebsiteUrl();
        dto.images = u.getImages();
        dto.cityName = u.getCity() != null ? u.getCity().getName() : null;
        dto.cityId = u.getCity() != null ? u.getCity().getId() : null;
        dto.costOfLivingMonthly = u.getCity() != null ? u.getCity().getCostOfLivingMonthly() : null;
        dto.favorited = favorited;
        dto.averageRating = avgRating;
        dto.reviewCount = reviewCount;
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Integer getRanking() { return ranking; }
    public BigDecimal getTuitionFeeYearly() { return tuitionFeeYearly; }
    public Double getIeltsRequirement() { return ieltsRequirement; }
    public Integer getToeflRequirement() { return toeflRequirement; }
    public String getJlptRequirement() { return jlptRequirement; }
    public Double getAcceptanceRate() { return acceptanceRate; }
    public String getPrograms() { return programs; }
    public String getDormitoryInfo() { return dormitoryInfo; }
    public String getWebsiteUrl() { return websiteUrl; }
    public List<String> getImages() { return images; }
    public String getCityName() { return cityName; }
    public Long getCityId() { return cityId; }
    public Integer getCostOfLivingMonthly() { return costOfLivingMonthly; }
    public boolean isFavorited() { return favorited; }
    public Double getAverageRating() { return averageRating; }
    public Long getReviewCount() { return reviewCount; }
}
