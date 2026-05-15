package com.japanuni.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cities")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "cost_of_living_monthly")
    private Integer costOfLivingMonthly;

    @Column(length = 500)
    private String imageUrl;

    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL)
    private List<University> universities = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getCostOfLivingMonthly() { return costOfLivingMonthly; }
    public void setCostOfLivingMonthly(Integer costOfLivingMonthly) { this.costOfLivingMonthly = costOfLivingMonthly; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<University> getUniversities() { return universities; }
    public void setUniversities(List<University> universities) { this.universities = universities; }
}
