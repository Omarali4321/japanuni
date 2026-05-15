package com.japanuni.dto;

import com.japanuni.entity.Review;
import java.time.Instant;

public class ReviewDto {
    private Long id;
    private Integer rating;
    private String comment;
    private String userName;
    private Instant createdAt;

    public static ReviewDto from(Review r) {
        ReviewDto dto = new ReviewDto();
        dto.id = r.getId();
        dto.rating = r.getRating();
        dto.comment = r.getComment();
        dto.userName = r.getUser().getFullName();
        dto.createdAt = r.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public String getUserName() { return userName; }
    public Instant getCreatedAt() { return createdAt; }
}
