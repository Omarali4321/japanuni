package com.japanuni.dto;

public class AdminStatsDto {
    private long users;
    private long universities;
    private long scholarships;
    private long reviews;
    private long favorites;

    public AdminStatsDto(long users, long universities, long scholarships, long reviews, long favorites) {
        this.users = users;
        this.universities = universities;
        this.scholarships = scholarships;
        this.reviews = reviews;
        this.favorites = favorites;
    }

    public long getUsers() { return users; }
    public long getUniversities() { return universities; }
    public long getScholarships() { return scholarships; }
    public long getReviews() { return reviews; }
    public long getFavorites() { return favorites; }
}
