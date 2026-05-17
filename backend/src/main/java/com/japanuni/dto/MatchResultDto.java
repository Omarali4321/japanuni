package com.japanuni.dto;

import java.util.List;

public class MatchResultDto {
    private UniversityDto university;
    private int score;
    private String fitLevel;
    private List<String> reasons;
    private List<String> gaps;

    public MatchResultDto() {}

    public MatchResultDto(UniversityDto university, int score, String fitLevel, List<String> reasons, List<String> gaps) {
        this.university = university;
        this.score = score;
        this.fitLevel = fitLevel;
        this.reasons = reasons;
        this.gaps = gaps;
    }

    public UniversityDto getUniversity() { return university; }
    public void setUniversity(UniversityDto university) { this.university = university; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getFitLevel() { return fitLevel; }
    public void setFitLevel(String fitLevel) { this.fitLevel = fitLevel; }
    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }
    public List<String> getGaps() { return gaps; }
    public void setGaps(List<String> gaps) { this.gaps = gaps; }
}
