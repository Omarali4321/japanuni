package com.japanuni;

import com.japanuni.entity.Role;
import com.japanuni.repository.UniversityRepository;
import com.japanuni.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class JapanUniApplicationTests {

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void contextLoadsAndSeedsDemoData() {
        assertThat(universityRepository.count()).isEqualTo(6);
        assertThat(userRepository.findByEmail("student@japanuni.com"))
                .isPresent()
                .get()
                .extracting("role")
                .isEqualTo(Role.USER);
        assertThat(userRepository.findByEmail("admin@japanuni.com"))
                .isPresent()
                .get()
                .extracting("role")
                .isEqualTo(Role.ADMIN);
    }
}
