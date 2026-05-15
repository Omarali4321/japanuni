package com.japanuni.config;

import com.japanuni.entity.*;
import com.japanuni.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final UniversityRepository universityRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final AdmissionGuideRepository admissionGuideRepository;
    private final VisaGuideRepository visaGuideRepository;
    private final StudentLifeArticleRepository studentLifeArticleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CityRepository cityRepository, UniversityRepository universityRepository,
                           ScholarshipRepository scholarshipRepository,
                           AdmissionGuideRepository admissionGuideRepository,
                           VisaGuideRepository visaGuideRepository,
                           StudentLifeArticleRepository studentLifeArticleRepository,
                           UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.cityRepository = cityRepository;
        this.universityRepository = universityRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.admissionGuideRepository = admissionGuideRepository;
        this.visaGuideRepository = visaGuideRepository;
        this.studentLifeArticleRepository = studentLifeArticleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private static final String IMG_UTOKYO = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80";
    private static final String IMG_KYOTO = "https://images.unsplash.com/photo-1493976040374-85c8e712f0f1?auto=format&fit=crop&w=1200&q=80";
    private static final String IMG_OSAKA = "https://images.unsplash.com/photo-1590559899732-03242af379ca?auto=format&fit=crop&w=1200&q=80";
    private static final String IMG_WASEDA = "https://images.unsplash.com/photo-1523580494876-6f3031224c94?auto=format&fit=crop&w=1200&q=80";
    private static final String IMG_KEIO = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";
    private static final String IMG_TITECH = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80";

    @Override
    @Transactional
    public void run(String... args) {
        if (universityRepository.count() > 0) {
            patchUniversityImages();
            return;
        }

        City tokyo = saveCity("Tokyo", "Japan's capital and global education hub.", 150000,
                "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800");
        City kyoto = saveCity("Kyoto", "Historic city with prestigious universities.", 130000,
                "https://images.unsplash.com/photo-1493976040374-85c8e712f0f1?w=800");
        City osaka = saveCity("Osaka", "Vibrant metropolis with strong engineering programs.", 120000,
                "https://images.unsplash.com/photo-1590559899732-03242af379ca?w=800");
        City yokohama = saveCity("Yokohama", "Port city near Tokyo with Keio campuses.", 140000,
                "https://images.unsplash.com/photo-1574263867127-a8b4d1aef8c7?w=800");

        saveUniversity("University of Tokyo", tokyo, 23,
                "Japan's top national university, renowned for research and innovation.",
                new BigDecimal("535800"), 7.0, 100, "N2", 28.0,
                "Engineering, Medicine, Law, Economics, Sciences",
                "On-campus dormitories available; apply early due to high demand.",
                "https://www.u-tokyo.ac.jp",
                List.of(IMG_UTOKYO));

        saveUniversity("Kyoto University", kyoto, 36,
                "Leading research university known for chemistry and physics Nobel laureates.",
                new BigDecimal("535800"), 6.5, 90, "N2", 35.0,
                "Integrated Human Studies, Engineering, Medicine, Agriculture",
                "International dormitories in Yoshida campus area.",
                "https://www.kyoto-u.ac.jp",
                List.of(IMG_KYOTO));

        saveUniversity("Osaka University", osaka, 68,
                "Major national university strong in medicine and engineering.",
                new BigDecimal("535800"), 6.5, 90, "N2", 40.0,
                "Medicine, Dentistry, Engineering, Law, Economics",
                "Toyonaka and Suita campuses offer student housing.",
                "https://www.osaka-u.ac.jp",
                List.of(IMG_OSAKA));

        saveUniversity("Waseda University", tokyo, 189,
                "Prestigious private university with a large international community.",
                new BigDecimal("1200000"), 6.5, 90, "N2", 45.0,
                "Political Science, Commerce, International Liberal Studies",
                "Multiple dorm options including Waseda International House.",
                "https://www.waseda.jp",
                List.of(IMG_WASEDA));

        saveUniversity("Keio University", yokohama, 201,
                "Japan's oldest private university with strong business programs.",
                new BigDecimal("1300000"), 6.5, 90, "N2", 42.0,
                "Economics, Business, Medicine, Policy Management",
                "Keio dormitories in Hiyoshi and Mita areas.",
                "https://www.keio.ac.jp",
                List.of(IMG_KEIO));

        saveUniversity("Tokyo Institute of Technology", tokyo, 55,
                "Top science and engineering university, now part of Institute of Science Tokyo.",
                new BigDecimal("535800"), 7.0, 100, "N2", 30.0,
                "Engineering, Materials Science, Computer Science, Life Science",
                "Ookayama campus dorms for international students.",
                "https://www.titech.ac.jp",
                List.of(IMG_TITECH));

        seedScholarships();
        seedGuides();
        seedUsers();
    }

    private void patchUniversityImages() {
        updateUniversityImage("University of Tokyo", IMG_UTOKYO);
        updateUniversityImage("Kyoto University", IMG_KYOTO);
        updateUniversityImage("Osaka University", IMG_OSAKA);
        updateUniversityImage("Waseda University", IMG_WASEDA);
        updateUniversityImage("Keio University", IMG_KEIO);
        updateUniversityImage("Tokyo Institute of Technology", IMG_TITECH);
    }

    private void updateUniversityImage(String name, String imageUrl) {
        universityRepository.findByName(name).ifPresent(u -> {
            List<String> images = new ArrayList<>();
            images.add(imageUrl);
            u.setImages(images);
            universityRepository.save(u);
        });
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@japanuni.com")) {
            User admin = new User();
            admin.setEmail("admin@japanuni.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("JapanUni Admin");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
        if (!userRepository.existsByEmail("student@japanuni.com")) {
            User student = new User();
            student.setEmail("student@japanuni.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setFullName("Demo Student");
            student.setNationality("International");
            student.setRole(Role.USER);
            userRepository.save(student);
        }
    }

    private City saveCity(String name, String desc, int cost, String image) {
        City city = new City();
        city.setName(name);
        city.setDescription(desc);
        city.setCostOfLivingMonthly(cost);
        city.setImageUrl(image);
        return cityRepository.save(city);
    }

    private void saveUniversity(String name, City city, int ranking, String desc,
                                BigDecimal tuition, double ielts, int toefl, String jlpt,
                                double acceptance, String programs, String dorm, String website,
                                List<String> images) {
        University u = new University();
        u.setName(name);
        u.setCity(city);
        u.setRanking(ranking);
        u.setDescription(desc);
        u.setTuitionFeeYearly(tuition);
        u.setIeltsRequirement(ielts);
        u.setToeflRequirement(toefl);
        u.setJlptRequirement(jlpt);
        u.setAcceptanceRate(acceptance);
        u.setPrograms(programs);
        u.setDormitoryInfo(dorm);
        u.setWebsiteUrl(website);
        u.setImages(images);
        universityRepository.save(u);
    }

    private void seedScholarships() {
        universityRepository.findAll().forEach(u -> {
            Scholarship mext = new Scholarship();
            mext.setTitle("MEXT Scholarship – " + u.getName());
            mext.setDescription("Japanese government scholarship covering tuition, monthly stipend, and travel.");
            mext.setAmountYearly(new BigDecimal("1440000"));
            mext.setCoverage("Full tuition + stipend");
            mext.setDeadlineMonth("April");
            mext.setEligibility("Bachelor's degree, age under 35, strong academic record");
            mext.setUniversity(u);
            scholarshipRepository.save(mext);

            Scholarship award = new Scholarship();
            award.setTitle(u.getName() + " International Excellence Award");
            award.setDescription("University-specific partial scholarship for outstanding international applicants.");
            award.setAmountYearly(new BigDecimal("500000"));
            award.setCoverage("Partial tuition");
            award.setDeadlineMonth("December");
            award.setEligibility("IELTS 6.5+ or TOEFL 90+, GPA 3.5+");
            award.setUniversity(u);
            scholarshipRepository.save(award);
        });
    }

    private void seedGuides() {
        admissionGuideRepository.saveAll(List.of(
                guide("Choose Your Program", "Planning", 1,
                        "Research English-taught (G30) and Japanese-taught programs. Check JLPT requirements for Japanese programs and IELTS/TOEFL for English programs."),
                guide("Prepare Documents", "Documents", 2,
                        "Typical documents: transcripts, diploma, passport copy, recommendation letters, research plan (graduate), language certificates (IELTS/TOEFL/JLPT)."),
                guide("Apply via University Portal", "Application", 3,
                        "Most universities use online application systems. Pay attention to intake periods: April and September are common."),
                guide("Entrance Exams & Interviews", "Exams", 4,
                        "Some programs require EJU, written exams, or online interviews. Prepare based on your target university guidelines.")
        ));

        visaGuideRepository.saveAll(List.of(
                visaGuide("Student Visa Overview", "Student", 1,
                        "International students need a Certificate of Eligibility (COE) from the university, then apply for a Student Visa at the Japanese embassy."),
                visaGuide("Required Documents", "Student", 2,
                        "Passport, COE, visa application form, photo, admission letter, financial proof, and sometimes bank statements from sponsor."),
                visaGuide("Part-time Work", "Student", 3,
                        "Student visa holders may work up to 28 hours per week after obtaining Permission to Engage in Activity Other Than Permitted.")
        ));

        studentLifeArticleRepository.saveAll(List.of(
                lifeArticle("Cost of Living in Tokyo", "Finance", 1,
                        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
                        "Expect ¥120,000–¥180,000/month including rent (share house ¥50k–¥80k), food, transport, and phone."),
                lifeArticle("Japanese Culture & Etiquette", "Culture", 2,
                        "https://images.unsplash.com/photo-1493976040374-85c8e712f0f1?w=800",
                        "Punctuality, respect, and quiet public behavior are valued. Learn basic phrases and bowing customs."),
                lifeArticle("Dormitory vs Apartment", "Housing", 3,
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                        "Dorms offer community and lower upfront costs. Private apartments offer more freedom but require key money and guarantor.")
        ));
    }

    private AdmissionGuide guide(String title, String category, int order, String content) {
        AdmissionGuide g = new AdmissionGuide();
        g.setTitle(title);
        g.setCategory(category);
        g.setSortOrder(order);
        g.setContent(content);
        return g;
    }

    private VisaGuide visaGuide(String title, String type, int order, String content) {
        VisaGuide g = new VisaGuide();
        g.setTitle(title);
        g.setVisaType(type);
        g.setSortOrder(order);
        g.setContent(content);
        return g;
    }

    private StudentLifeArticle lifeArticle(String title, String category, int order, String image, String content) {
        StudentLifeArticle a = new StudentLifeArticle();
        a.setTitle(title);
        a.setCategory(category);
        a.setSortOrder(order);
        a.setImageUrl(image);
        a.setContent(content);
        return a;
    }
}
