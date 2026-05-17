package com.japanuni.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

public class MatchRequest {
    private String field;

    @Min(0)
    private BigDecimal budgetYearly;

    @DecimalMin("0.0")
    private Double ieltsScore;

    private String jlptLevel;
    private Long cityId;

    public String getField() { return field; }
    public void setField(String field) { this.field = field; }
    public BigDecimal getBudgetYearly() { return budgetYearly; }
    public void setBudgetYearly(BigDecimal budgetYearly) { this.budgetYearly = budgetYearly; }
    public Double getIeltsScore() { return ieltsScore; }
    public void setIeltsScore(Double ieltsScore) { this.ieltsScore = ieltsScore; }
    public String getJlptLevel() { return jlptLevel; }
    public void setJlptLevel(String jlptLevel) { this.jlptLevel = jlptLevel; }
    public Long getCityId() { return cityId; }
    public void setCityId(Long cityId) { this.cityId = cityId; }
}
