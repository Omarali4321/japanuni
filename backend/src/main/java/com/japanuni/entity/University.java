package com.japanuni.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "universities")
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer ranking;

    @Column(name = "tuition_fee_yearly")
    private BigDecimal tuitionFeeYearly;

    @Column(name = "ielts_requirement")
    private Double ieltsRequirement;

    @Column(name = "toefl_requirement")
    private Integer toeflRequirement;

    @Column(name = "jlpt_requirement")
    private String jlptRequirement;

    @Column(name = "acceptance_rate")
    private Double acceptanceRate;

    @Column(columnDefinition = "TEXT")
    private String programs;

    @Column(columnDefinition = "TEXT")
    private String dormitoryInfo;

    @Column(length = 500)
    private String websiteUrl;

    @ElementCollection
    @CollectionTable(name = "university_images", joinColumns = @JoinColumn(name = "university_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City city;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Scholarship> scholarships = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorite> favorites = new ArrayList<>();

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getRanking() { return ranking; }
    public void setRanking(Integer ranking) { this.ranking = ranking; }
    public BigDecimal getTuitionFeeYearly() { return tuitionFeeYearly; }
    public void setTuitionFeeYearly(BigDecimal tuitionFeeYearly) { this.tuitionFeeYearly = tuitionFeeYearly; }
    public Double getIeltsRequirement() { return ieltsRequirement; }
    public void setIeltsRequirement(Double ieltsRequirement) { this.ieltsRequirement = ieltsRequirement; }
    public Integer getToeflRequirement() { return toeflRequirement; }
    public void setToeflRequirement(Integer toeflRequirement) { this.toeflRequirement = toeflRequirement; }
    public String getJlptRequirement() { return jlptRequirement; }
    public void setJlptRequirement(String jlptRequirement) { this.jlptRequirement = jlptRequirement; }
    public Double getAcceptanceRate() { return acceptanceRate; }
    public void setAcceptanceRate(Double acceptanceRate) { this.acceptanceRate = acceptanceRate; }
    public String getPrograms() { return programs; }
    public void setPrograms(String programs) { this.programs = programs; }
    public String getDormitoryInfo() { return dormitoryInfo; }
    public void setDormitoryInfo(String dormitoryInfo) { this.dormitoryInfo = dormitoryInfo; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public City getCity() { return city; }
    public void setCity(City city) { this.city = city; }
    public List<Scholarship> getScholarships() { return scholarships; }
    public void setScholarships(List<Scholarship> scholarships) { this.scholarships = scholarships; }
    public List<Favorite> getFavorites() { return favorites; }
    public void setFavorites(List<Favorite> favorites) { this.favorites = favorites; }
    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }
}
