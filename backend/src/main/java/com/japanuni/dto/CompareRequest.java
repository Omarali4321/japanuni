package com.japanuni.dto;

import jakarta.validation.constraints.Size;
import java.util.List;

public class CompareRequest {
    @Size(min = 2, max = 4)
    private List<Long> universityIds;

    public List<Long> getUniversityIds() { return universityIds; }
    public void setUniversityIds(List<Long> universityIds) { this.universityIds = universityIds; }
}
