package com.japanuni.dto;

import com.japanuni.entity.City;

public class CityDto {
    private Long id;
    private String name;
    private String description;
    private Integer costOfLivingMonthly;
    private String imageUrl;

    public static CityDto from(City c) {
        CityDto dto = new CityDto();
        dto.id = c.getId();
        dto.name = c.getName();
        dto.description = c.getDescription();
        dto.costOfLivingMonthly = c.getCostOfLivingMonthly();
        dto.imageUrl = c.getImageUrl();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Integer getCostOfLivingMonthly() { return costOfLivingMonthly; }
    public String getImageUrl() { return imageUrl; }
}
