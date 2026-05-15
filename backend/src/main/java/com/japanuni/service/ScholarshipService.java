package com.japanuni.service;

import com.japanuni.dto.PageResponse;
import com.japanuni.dto.ScholarshipDto;
import com.japanuni.entity.Scholarship;
import com.japanuni.exception.ResourceNotFoundException;
import com.japanuni.repository.ScholarshipRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;

    public ScholarshipService(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    public PageResponse<ScholarshipDto> search(String search, Long universityId, int page, int size) {
        Page<Scholarship> result = scholarshipRepository.search(search, universityId, PageRequest.of(page, size));
        var dtos = result.getContent().stream().map(ScholarshipDto::from).toList();
        return new PageResponse<>(dtos, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public ScholarshipDto getById(Long id) {
        Scholarship s = scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found"));
        return ScholarshipDto.from(s);
    }
}
