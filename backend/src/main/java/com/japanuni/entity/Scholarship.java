package com.japanuni.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "amount_yearly")
    private BigDecimal amountYearly;

    @Column(length = 50)
    private String coverage;

    @Column(name = "deadline_month")
    private String deadlineMonth;

    @Column(name = "eligibility", columnDefinition = "TEXT")
    private String eligibility;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id")
    private University university;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmountYearly() { return amountYearly; }
    public void setAmountYearly(BigDecimal amountYearly) { this.amountYearly = amountYearly; }
    public String getCoverage() { return coverage; }
    public void setCoverage(String coverage) { this.coverage = coverage; }
    public String getDeadlineMonth() { return deadlineMonth; }
    public void setDeadlineMonth(String deadlineMonth) { this.deadlineMonth = deadlineMonth; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public University getUniversity() { return university; }
    public void setUniversity(University university) { this.university = university; }
}
