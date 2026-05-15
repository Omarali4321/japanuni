package com.japanuni.dto;

import com.japanuni.entity.Scholarship;
import java.math.BigDecimal;

public class ScholarshipDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal amountYearly;
    private String coverage;
    private String deadlineMonth;
    private String eligibility;
    private Long universityId;
    private String universityName;

    public static ScholarshipDto from(Scholarship s) {
        ScholarshipDto dto = new ScholarshipDto();
        dto.id = s.getId();
        dto.title = s.getTitle();
        dto.description = s.getDescription();
        dto.amountYearly = s.getAmountYearly();
        dto.coverage = s.getCoverage();
        dto.deadlineMonth = s.getDeadlineMonth();
        dto.eligibility = s.getEligibility();
        dto.universityId = s.getUniversity() != null ? s.getUniversity().getId() : null;
        dto.universityName = s.getUniversity() != null ? s.getUniversity().getName() : null;
        return dto;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public BigDecimal getAmountYearly() { return amountYearly; }
    public String getCoverage() { return coverage; }
    public String getDeadlineMonth() { return deadlineMonth; }
    public String getEligibility() { return eligibility; }
    public Long getUniversityId() { return universityId; }
    public String getUniversityName() { return universityName; }
}
