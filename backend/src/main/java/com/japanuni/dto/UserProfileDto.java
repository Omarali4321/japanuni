package com.japanuni.dto;

import com.japanuni.entity.Role;
import com.japanuni.entity.User;

public class UserProfileDto {
    private Long id;
    private String email;
    private String fullName;
    private String bio;
    private String nationality;
    private String avatarUrl;
    private Role role;

    public static UserProfileDto from(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.id = user.getId();
        dto.email = user.getEmail();
        dto.fullName = user.getFullName();
        dto.bio = user.getBio();
        dto.nationality = user.getNationality();
        dto.avatarUrl = user.getAvatarUrl();
        dto.role = user.getRole();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
