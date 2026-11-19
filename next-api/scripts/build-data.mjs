#!/usr/bin/env node
/**
 * Build script: generates static JSON data files from CSV and Prisma seed data.
 * Runs in prebuild so Vercel builds data at deploy time.
 * No new dependencies — uses Node built-ins + existing csv-parse, iconv-lite.
 */

import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import iconv from 'iconv-lite'
import { parse } from 'csv-parse/sync'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'data')
const UNIV_DIR = join(DATA_DIR, 'universities')
const GUIDES_DIR = join(DATA_DIR, 'guides')
const CSV_PATH = join(ROOT, 'data-src', 'School_Search_Result.csv')

// Ensure output directories exist
mkdirSync(UNIV_DIR, { recursive: true })
mkdirSync(GUIDES_DIR, { recursive: true })

// --- CSV Parsing ---
const headers = {
  major1: 'Major of Study 1',
  major2: 'Major of Study 2',
  school: 'School Name',
  type: 'Type',
  faculty: 'Faculty',
  url: 'Web site(faculty/department)',
  speciality: 'Major /Speciality  Division',
  degree: 'Degree',
  begins1: 'Begins in(1)',
  begins2: 'Begins in(2)',
  medium: 'Medium of Instruction',
  preArrival: 'Pre-arrival admission',
}

function normalize(value) {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function uniqueValues(values) {
  return [...new Set(values.map(normalize).filter(Boolean))]
}

function joinValues(values, separator = ' | ') {
  return uniqueValues(values).join(separator) || null
}

function sourceKey(schoolName) {
  return normalize(schoolName).toLocaleLowerCase('en-US')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
}

function rowHash(rows) {
  return createHash('sha256').update(JSON.stringify(rows)).digest('hex')
}

// Decode HTML entities and remove control characters
function cleanText(value) {
  if (!value) return null
  let text = String(value)
  // Fix known typos from CSV
  text = text.replace(/Doctral/gi, 'Doctoral')
  // Decode common HTML entities
  text = text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&yen;/g, '¥')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&bull;/g, '•')
    .replace(/&hellip;/g, '…')
  // Remove control characters (e.g., \u0002)
  text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim()
  return text || null
}

// Read and parse CSV
console.log('Reading CSV...')
const input = readFileSync(CSV_PATH)
const text = iconv.decode(input, 'cp932')
const rows = parse(text, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  relax_column_count: true,
  trim: false,
})

// Group by school
const grouped = new Map()
for (const row of rows) {
  const school = normalize(row[headers.school])
  if (!school) continue
  const key = sourceKey(school)
  grouped.set(key, [...(grouped.get(key) ?? []), row])
}

console.log(`Grouped into ${grouped.size} unique universities`)

// --- Generate University Records ---
const records = [...grouped.entries()].map(([key, schoolRows], index) => {
  const first = schoolRows[0]
  // Use ONLY Faculty and Speciality for programs (NOT Major of Study 1/2 which are cumulative)
  const facultyValues = schoolRows.map((row) => row[headers.faculty])
  const specialityValues = schoolRows.map((row) => row[headers.speciality])
  const programValues = [...facultyValues, ...specialityValues]
  const urls = uniqueValues(schoolRows.map((row) => row[headers.url]))

  // Clean all text fields
  const cleanName = cleanText(first[headers.school])
  const cleanFaculty = joinValues(facultyValues.map(cleanText))
  const cleanSpeciality = joinValues(specialityValues.map(cleanText))
  const cleanPrograms = joinValues(programValues.map(cleanText))
  const cleanDegree = joinValues(schoolRows.map((row) => cleanText(row[headers.degree])))
  const cleanInstitutionType = joinValues(schoolRows.map((row) => cleanText(row[headers.type])))
  const cleanIntake = joinValues(schoolRows.flatMap((row) => [
    cleanText(row[headers.begins1]),
    cleanText(row[headers.begins2]),
  ]))
  const cleanMedium = joinValues(schoolRows.map((row) => cleanText(row[headers.medium])))
  const cleanPreArrival = joinValues(schoolRows.map((row) => cleanText(row[headers.preArrival])))
  const cleanWebsiteUrl = urls[0] ? cleanText(urls[0]).slice(0, 500) : null
  const cleanSourceUrl = urls[0] ? cleanText(urls[0]).slice(0, 1000) : null

  // programCount = number of unique program entries (faculty + speciality)
  const programCount = uniqueValues(programValues.map(cleanText)).length

  return {
    id: index + 1, // 1-based stable ID
    sourceKey: key,
    name: cleanName,
    programs: cleanPrograms,
    programCount,
    websiteUrl: cleanWebsiteUrl,
    sourceDataset: 'School_Search_Result.csv',
    sourceUrl: cleanSourceUrl,
    institutionType: cleanInstitutionType,
    faculty: cleanFaculty,
    degree: cleanDegree,
    intake: cleanIntake,
    mediumOfInstruction: cleanMedium,
    preArrivalAdmission: cleanPreArrival,
    majorSpeciality: cleanSpeciality,
    sourceRowHash: rowHash(schoolRows),
    sourceRowCount: schoolRows.length,
    // Fields not in CSV — will be enriched later or left null
    description: null,
    ranking: null,
    tuitionFeeYearly: null,
    ieltsRequirement: null,
    toeflRequirement: null,
    jlptRequirement: null,
    acceptanceRate: null,
    dormitoryInfo: null,
    cityId: null,
    cityName: null,
    costOfLivingMonthly: null,
    images: [],
    scholarships: [],
  }
})

// --- Build Index (compact for list/search/filter) ---
// Include fields needed for list, search, filters, AND matching
const indexFields = [
  'id', 'sourceKey', 'name', 'institutionType',
  'cityName', 'cityId', 'intake', 'mediumOfInstruction',
  'preArrivalAdmission', 'programCount',
  'faculty', // first 3 faculty names for display
  'tuitionFeeYearly', 'ieltsRequirement', 'jlptRequirement', 'ranking', 'programs', 'majorSpeciality',
]

const index = records.map((r) => {
  const entry = {}
  for (const field of indexFields) {
    entry[field] = r[field]
  }
  // Limit faculty to first 3 for index display
  if (entry.faculty) {
    entry.faculty = entry.faculty.split(' | ').slice(0, 3).join(' | ')
  }
  return entry
})

// --- Write universities-index.json ---
const indexPath = join(DATA_DIR, 'universities-index.json')
writeFileSync(indexPath, JSON.stringify(index, null, 0))
console.log(`Wrote ${indexPath} (${index.length} universities)`)

// --- Write individual university files ---
let written = 0
for (const record of records) {
  const filePath = join(UNIV_DIR, `${record.id}.json`)
  writeFileSync(filePath, JSON.stringify(record, null, 0))
  written++
}
console.log(`Wrote ${written} university detail files to ${UNIV_DIR}`)

// --- Generate Cities (static reference data) ---
// Note: CSV does not contain city information for universities.
// Cities are kept as reference data but cityId/cityName on universities remain null.
// The city filter on /universities will be hidden until city data is available.
const cities = [
  { id: 1, name: 'Tokyo', description: 'Japan\'s capital and largest city', costOfLivingMonthly: 150000, imageUrl: null },
  { id: 2, name: 'Kyoto', description: 'Former imperial capital, cultural heart', costOfLivingMonthly: 120000, imageUrl: null },
  { id: 3, name: 'Osaka', description: 'Kansai region\'s economic hub', costOfLivingMonthly: 110000, imageUrl: null },
  { id: 4, name: 'Fukuoka', description: 'Gateway to Asia, vibrant startup scene', costOfLivingMonthly: 100000, imageUrl: null },
  { id: 5, name: 'Sapporo', description: 'Hokkaido\'s capital, famous for snow festival', costOfLivingMonthly: 90000, imageUrl: null },
  { id: 6, name: 'Nagoya', description: 'Central Japan\'s industrial center', costOfLivingMonthly: 100000, imageUrl: null },
  { id: 7, name: 'Kobe', description: 'Port city with international atmosphere', costOfLivingMonthly: 110000, imageUrl: null },
  { id: 8, name: 'Hiroshima', description: 'City of peace, Chugoku region center', costOfLivingMonthly: 95000, imageUrl: null },
  { id: 9, name: 'Sendai', description: 'Tohoku region\'s largest city', costOfLivingMonthly: 90000, imageUrl: null },
  { id: 10, name: 'Yokohama', description: 'Major port city near Tokyo', costOfLivingMonthly: 130000, imageUrl: null },
]
writeFileSync(join(DATA_DIR, 'cities.json'), JSON.stringify(cities, null, 2))
console.log(`Wrote ${cities.length} cities to ${DATA_DIR}/cities.json`)

// --- Generate Scholarships (static reference data) ---
// Map universityId by sourceKey, not by sequential ID
const sourceKeyToId = new Map(records.map(r => [r.sourceKey, r.id]))
const scholarships = [
  { id: 1, title: 'MEXT Scholarship', description: 'Japanese Government Scholarship for international students', amountYearly: '1440000', coverage: 'Full', deadlineMonth: 'May', eligibility: 'Undergraduate, Masters, PhD', universityId: null },
  { id: 2, title: 'JASSO Honors Scholarship', description: 'Monthly stipend for privately financed international students', amountYearly: '576000', coverage: 'Partial', deadlineMonth: 'Varies', eligibility: 'Undergraduate, Graduate', universityId: null },
  { id: 3, title: 'ADB-Japan Scholarship', description: 'Asian Development Bank scholarship for development studies', amountYearly: '2000000', coverage: 'Full', deadlineMonth: 'March', eligibility: 'Masters', universityId: null },
  { id: 4, title: 'Rotary Yoneyama Memorial', description: 'Scholarship for international students in Japan', amountYearly: '1200000', coverage: 'Partial', deadlineMonth: 'October', eligibility: 'Undergraduate, Graduate', universityId: null },
  { id: 5, title: 'University of Tokyo Fellowship', description: 'Merit-based fellowship for graduate students', amountYearly: '1500000', coverage: 'Full', deadlineMonth: 'January', eligibility: 'Masters, PhD', universityId: sourceKeyToId.get('the-university-of-tokyo') ?? null },
  { id: 6, title: 'Kyoto University Scholarship', description: 'Support for outstanding international students', amountYearly: '1200000', coverage: 'Partial', deadlineMonth: 'February', eligibility: 'All levels', universityId: sourceKeyToId.get('kyoto-university') ?? null },
]
writeFileSync(join(DATA_DIR, 'scholarships.json'), JSON.stringify(scholarships, null, 2))
console.log(`Wrote ${scholarships.length} scholarships to ${DATA_DIR}/scholarships.json`)

// --- Generate Guides (static reference data) ---
const admissionGuides = [
  {
    id: 1,
    title: 'Undergraduate Application Process',
    content: `Complete guide to applying for undergraduate (bachelor's) programs at Japanese universities.

**Application Timeline**
- **April intake (main):** Applications typically open September–November of the previous year; deadlines January–March.
- **September/October intake (some programs):** Applications open April–June; deadlines July–August.

**General Requirements**
1. **12 years of education:** Completion of upper secondary school (or equivalent) recognized by MEXT.
2. **Academic transcripts:** Official transcripts from all years of high school, translated into Japanese or English.
3. **Language proficiency:**
   - Japanese-taught programs: JLPT N2 or N1 (varies by university).
   - English-taught programs (G30/SGU): TOEFL iBT 79+, IELTS 6.0+, or equivalent.
4. **Entrance examinations:**
   - EJU (Examination for Japanese University Admission for International Students) — required for most Japanese-taught programs.
   - University-specific exams (essay, interview, subject tests).
5. **Application documents:**
   - Completed application form (online or paper).
   - Statement of Purpose / Research Plan (400–1,000 words).
   - 1–2 letters of recommendation (from teachers/professors).
   - Proof of financial ability (bank statement, sponsor letter).
   - Passport copy.
   - Photos (typically 4cm × 3cm).

**Key Exams**
- **EJU:** Held twice yearly (June, November) in Japan and select overseas locations. Covers Japanese as a Foreign Language, Science, Japan and the World, Mathematics.
- **JLPT:** Held twice yearly (July, December). N1/N2 required for degree programs.
- **English tests:** TOEFL, IELTS, TOEIC accepted for English-taught programs.

**Selection Methods**
- Document screening only (some English-taught programs).
- Document screening + interview (online or in-person).
- Document screening + written exam + interview.

**Sources:** MEXT "Study in Japan" official guide, JASSO EJU guidelines, individual university admission pages. **Last updated: November 2024.**`,
    category: 'Undergraduate',
    sortOrder: 1
  },
  {
    id: 2,
    title: 'Graduate School Application Guide',
    content: `How to apply for Master's and PhD programs in Japan.

**Application Timeline**
- **April intake:** Applications typically open June–September; deadlines October–January.
- **October intake:** Applications open December–March; deadlines April–June.
- **Check each graduate school** — deadlines vary significantly by department.

**Requirements (Master's)**
1. **Bachelor's degree:** 16 years of education (or equivalent) from an accredited institution.
2. **Academic transcripts:** Official transcripts from all undergraduate years.
3. **Research proposal:** 1,000–2,000 words outlining research interest, methodology, and relevance.
4. **Language proficiency:**
   - Japanese-taught: JLPT N1 or N2 (varies by lab/department).
   - English-taught: TOEFL iBT 80+, IELTS 6.5+, TOEIC 750+.
5. **Letters of recommendation:** 2–3 from academic supervisors/professors.
6. **Entrance exams:** Written exam (specialized subject), oral exam/interview.

**Requirements (PhD)**
1. **Master's degree** (or equivalent research experience).
2. **Detailed research proposal:** 3,000–5,000 words with literature review and methodology.
3. **Publications:** Prior research output strengthens application.
4. **Supervisor contact:** **Critical** — secure informal acceptance (内諾, nonei) from a professor before applying.
5. **Same language and document requirements as Master's.**

**Finding a Supervisor (PhD)**
1. Search university research labs by keyword.
2. Read recent papers by potential supervisors.
3. Email with: brief intro, research interest alignment, CV, research proposal outline.
4. Follow up after 1–2 weeks. Many professors prefer introduction via your current professor.

**Sources:** MEXT "Graduate School Admission" guide, JASSO, university graduate school pages. **Last updated: November 2024.**`,
    category: 'Graduate',
    sortOrder: 2
  },
  {
    id: 3,
    title: 'EJU Examination Guide',
    content: `Everything you need to know about the Examination for Japanese University Admission for International Students (EJU).

**What is EJU?**
A standardized test used by Japanese universities to evaluate the Japanese language proficiency and basic academic abilities of international students applying for undergraduate programs.

**Test Subjects (choose based on program requirements)**
1. **Japanese as a Foreign Language** (125 min, 0–400 pts + 0–50 pts writing)
   - Reading comprehension, listening, listening-reading comprehension, writing.
2. **Science** (80 min, 0–200 pts) — Physics, Chemistry, Biology (choose 2)
3. **Japan and the World** (80 min, 0–200 pts)
   - Politics, economy, society, geography, history.
4. **Mathematics** (80 min, 0–200 pts) — Course 1 (liberal arts) or Course 2 (science)

**Test Schedule**
- **1st Session:** Mid-June (application: February–March)
- **2nd Session:** Mid-November (application: July–August)
- Held in Japan and 18+ overseas cities.

**Scoring & University Requirements**
- Each university sets its own subject requirements and minimum scores.
- Example: National universities often require Japanese (200+) + Science (2 subjects) + Math.
- English-taught (G30) programs may waive EJU requirement.

**Preparation Resources**
- Official EJU syllabus and past papers (JASSO website).
- "EJU Practice Questions" books.
- Japanese language schools offer EJU prep courses.

**Registration**
- Online via JASSO My Page (Japanese only).
- Fee: ¥10,000 (1 subject), ¥18,000 (2–3 subjects) — higher for overseas centers.
- Results: ~1 month after test, valid for 2 years.

**Sources:** JASSO official EJU guide, MEXT Study in Japan. **Last updated: November 2024.**`,
    category: 'Exams',
    sortOrder: 3
  },
  {
    id: 4,
    title: 'Document Preparation Checklist',
    content: `Complete checklist of required documents for Japanese university applications.

**For All Applications**
- [ ] Completed application form (university-specific, often online)
- [ ] Application fee payment receipt (typically ¥5,000–¥35,000)
- [ ] Passport copy (photo page)
- [ ] Passport-style photos (4cm × 3cm, white background, taken within 3 months)
- [ ] Certificate of graduation / expected graduation
- [ ] Official academic transcripts (all years, sealed or certified)
- [ ] Language test certificates (original or certified copy)
  - JLPT: Certificate of Result and Scores
  - TOEFL/IELTS: Official score report (sent directly by ETS/British Council)
  - EJU: Score notice
- [ ] Statement of Purpose / Research Plan
- [ ] Letters of recommendation (1–3, sealed, with referee contact info)
- [ ] Proof of financial ability
  - Bank balance certificate (¥2,000,000+ for 1 year)
  - Sponsor's letter of guarantee + sponsor's bank certificate + relationship proof
  - Scholarship award letter (if applicable)

**Additional for Graduate Applications**
- [ ] Bachelor's degree certificate + transcript
- [ ] Master's degree certificate + transcript (PhD applicants)
- [ ] Detailed research proposal (1,000–5,000 words)
- [ ] Abstract of master's thesis (PhD)
- [ ] List of publications / research achievements
- [ ] Supervisor acceptance letter / email (PhD, highly recommended)

**Translation Requirements**
- Documents not in Japanese or English must be translated by a certified translator.
- Translations must include translator's declaration, signature, and date.
- Some universities accept self-translations with a declaration.

**Submission Methods**
- **Online upload:** Most universities now use web portals (e.g., T-cens, DreamApply, custom systems).
- **Postal mail:** Registered mail (EMS, DHL) if required. Send well before deadline.
- **In-person:** Rare, only for some entrance exams.

**Common Pitfalls**
- Expired language test scores (valid 2 years).
- Unsealed recommendation letters.
- Missing financial proof for visa application later.
- Name mismatch between passport and documents.

**Sources:** MEXT, JASSO, university admission offices. **Last updated: November 2024.**`,
    category: 'Documents',
    sortOrder: 4
  }
]
writeFileSync(join(GUIDES_DIR, 'admission.json'), JSON.stringify(admissionGuides, null, 2))

const visaGuides = [
  {
    id: 1,
    title: 'Student Visa (COE) Application',
    content: `Complete guide to obtaining a Certificate of Eligibility (COE) and student visa for Japan.

**What is a COE?**
The Certificate of Eligibility is a document issued by the Immigration Services Agency of Japan certifying that a foreign national meets the conditions for landing in Japan under a specific status of residence (e.g., "Student"). It is **not** a visa — it is a prerequisite for visa issuance.

**Who Applies?**
**Your university applies on your behalf** after you are admitted. You provide documents; the university submits the application to the regional immigration bureau.

**Documents You Provide to Your University**
1. **COE application form** (university provides)
2. **Photo** (4cm × 3cm, white background, taken within 3 months)
3. **Passport copy** (photo page)
4. **Admission letter** (from the university)
5. **Proof of financial ability** (one of the following):
   - Bank balance certificate showing ¥2,000,000+ (for 1 year tuition + living)
   - Scholarship award letter (MEXT, JASSO, university, private)
   - Sponsor's letter of guarantee + sponsor's bank certificate + relationship proof (birth certificate, etc.)
   - Combination of above
6. **Academic documents** (graduation certificate, transcripts) — copies
7. **Language test results** — copies
8. **Additional documents** (varies by university/region):
   - Statement of purpose
   - Curriculum vitae
   - Proof of previous visa applications to Japan (if any)

**Timeline**
1. **Admission** → University requests your documents.
2. **You submit documents** → University reviews and submits to Immigration Bureau.
3. **Processing:** 1–3 months (varies by region and season; peak: February–March).
4. **COE issued** → University sends COE to you (original or PDF).
5. **You apply for visa** at Japanese embassy/consulate in your home country (1–2 weeks).
6. **Enter Japan** → Receive residence card at airport (Narita, Haneda, Kansai, Chubu, Fukuoka).

**Important Notes**
- COE validity: **3 months from issuance**. Apply for visa and enter Japan within this period.
- The COE lists your university and status. Changing universities requires a new COE.
- No fee for COE application (paid by university). Visa fee: ~¥3,000 (varies by nationality).
- **Dependents (spouse/children):** Apply for "Dependent" COE separately after your COE is issued.

**Sources:** Immigration Services Agency of Japan, MEXT "Student Visa Guide". **Last updated: November 2024.**`,
    visaType: 'Student',
    sortOrder: 1
  },
  {
    id: 2,
    title: 'Visa Extension & Renewal',
    content: `How to extend or renew your student visa (Status of Residence: "Student") in Japan.

**When to Apply**
- **Apply 3 months before expiry** (you can apply up to 3 months early).
- Do not let your residence card expire — overstaying leads to deportation.

**Where to Apply**
- **Regional Immigration Services Bureau** with jurisdiction over your address.
- Major offices: Tokyo, Shinagawa, Osaka, Nagoya, Fukuoka, Sapporo, Sendai, Hiroshima, Takamatsu.
- Online reservation required for most offices (via Immigration Bureau website).

**Required Documents**
1. **Application form** (available at office or download from Immigration website)
2. **Passport** (original + copy of photo page)
3. **Residence card** (original + copy)
4. **Photo** (4cm × 3cm, white background, taken within 3 months)
5. **Certificate of enrollment** (在学証明書) from university — issued within 3 months
6. **Transcript / grade report** (成績証明書) — proves academic progress
7. **Proof of financial ability** (same as initial COE: bank certificate, scholarship letter, or sponsor docs)
8. **Tuition payment receipt** (for current/upcoming semester)
9. **Fee:** ¥4,000 (revenue stamp, purchased at office)

**Processing Time**
- **2 weeks to 2 months** (varies by office and season).
- You receive a "stamp" on your residence card extending the period of stay.
- New residence card issued if period changes or card is near expiry.

**Common Reasons for Denial**
- Poor attendance / academic performance.
- Insufficient financial proof.
- Working over 28 hours/week without permission.
- Criminal record or immigration violations.

**After Extension**
- Update your residence card address at city hall within 14 days if you move.
- Notify university of new period of stay.
- If you graduate early or withdraw, you must change status or leave Japan.

**Sources:** Immigration Services Agency of Japan, university international offices. **Last updated: November 2024.**`,
    visaType: 'Student',
    sortOrder: 2
  },
  {
    id: 3,
    title: 'Work Permission for Students',
    content: `Rules for part-time work on a student visa (Status of Residence: "Student").

**Permission Required**
You **must** obtain "Permission to Engage in Activity Other Than That Permitted Under the Status of Residence" (資格外活動許可) **before** starting any work.

**How to Apply**
- **At airport on entry:** Check the box on the disembarkation card → receive stamp on residence card.
- **At immigration office:** Submit application form + passport + residence card + enrollment certificate. Free, same-day issuance possible.
- **Online:** Via Immigration Bureau e-application system (requires My Number card).

**Working Hour Limits**
- **During term:** Maximum **28 hours per week** (combined across all jobs).
- **During long vacations** (summer, winter, spring break as defined by university): Maximum **40 hours per week** (8 hours/day).
- **Research/TA positions at your university:** Often exempt from 28-hour limit (check with university).

**Prohibited Work**
- Adult entertainment (bars, clubs, pachinko, etc.).
- Gambling-related work.
- Work that interferes with studies.

**Tax & Social Insurance**
- **Income tax:** Progressive rates (5–45%). Employer withholds; file tax return (確定申告) if multiple employers or income > ¥200,000 from side jobs.
- **Residence tax:** Based on prior year income; billed by city/ward from June.
- **Social insurance:** Not required for students working <20 hours/week at one employer. If ≥20 hours, employer must enroll you in health insurance + pension.

**Finding Part-Time Jobs**
- University career center / job board.
- Websites: TownWork, Baitoru, Indeed Japan, GaijinPot Jobs.
- Convenience stores, restaurants, tutoring, translation, IT/engineering internships.

**Penalties for Violations**
- Working without permission: Up to 1 year imprisonment / ¥1,000,000 fine + deportation.
- Exceeding hours: Warning → revocation of permission → possible visa cancellation.

**Sources:** Immigration Services Agency, Ministry of Health Labour and Welfare. **Last updated: November 2024.**`,
    visaType: 'Student',
    sortOrder: 3
  },
  {
    id: 4,
    title: 'Post-Graduation Work Visa',
    content: `Transitioning from student visa to work visa after graduation.

**Main Work Visa Categories for Graduates**
1. **Engineer / Specialist in Humanities / International Services** (技術・人文知識・国際業務)
   - Most common for university graduates.
   - Covers: IT, engineering, business, marketing, translation, design, education, etc.
   - Requires: Bachelor's degree + job offer in related field.
2. **Highly Skilled Professional** (高度専門職)
   - Points-based (education, salary, experience, age, Japanese level).
   - Fast-track to permanent residence (1–3 years).
3. **Specified Skilled Worker** (特定技能)
   - For specific industries (nursing, construction, agriculture, etc.).
   - Requires passing skills test + Japanese test (JFT-Basic or JLPT N4).
4. **Business Manager** (経営・管理)
   - For starting a business or managing a company.
   - Requires ¥5,000,000+ capital, office space, business plan.

**Job Hunting Timeline**
- **Start 1 year before graduation** (April graduates: start April of final year).
- **Shukatsu (就活) season:** Company info sessions (March), applications (April–June), interviews (June–August), offers (October+).
- **University career centers:** Job fairs, counseling, alumni networks, exclusive postings.

**Changing Status of Residence**
1. **Secure job offer** (内定, naitei) with employment contract.
2. **Apply for Change of Status** at Immigration Bureau (can apply 3 months before graduation).
3. **Required documents:**
   - Application form + photo
   - Passport + residence card
   - Graduation certificate (or expected graduation certificate)
   - Transcript
   - Employment contract / offer letter (with salary, duties, company info)
   - Company registration certificate (登記事項証明書) + financial statements
   - Fee: ¥4,000 (revenue stamp)
4. **Processing:** 2 weeks – 2 months.
5. **New residence card** issued with "Engineer/Specialist in Humanities/International Services" status.

**Important Notes**
- You **cannot** work full-time until the status change is approved.
- If you graduate without a job, you can apply for **"Job Seeker" status** (特定活動・就職活動) — valid 6–12 months, allows job hunting.
- **Permanent residence:** Eligible after 10 years (or 1–3 years on Highly Skilled Professional visa).

**Sources:** Immigration Services Agency, MEXT "Career Guide for International Students". **Last updated: November 2024.**`,
    visaType: 'Work',
    sortOrder: 4
  }
]
writeFileSync(join(GUIDES_DIR, 'visa.json'), JSON.stringify(visaGuides, null, 2))

const studentLifeArticles = [
  {
    id: 1,
    title: 'Finding Accommodation in Japan',
    content: `Comprehensive guide to student housing options in Japan.

**Types of Accommodation**

**1. University Dormitories (寮, Ryō)**
- **Cost:** ¥20,000–¥50,000/month (often includes utilities).
- **Pros:** Cheap, close to campus, community, support staff.
- **Cons:** Limited spaces, curfews (some), shared facilities, application deadline early (often 6+ months before).
- **Apply:** Through university international office immediately after admission.

**2. Private Apartments (アパート / マンション)**
- **Cost:** ¥50,000–¥120,000/month (Tokyo), ¥35,000–¥80,000 (other cities).
- **Key fees:** Key money (礼金, reikin = 1–2 months rent), deposit (敷金, shikikin = 1–2 months), agency fee (仲介手数料 = 1 month + tax), guarantor company fee (0.5–1 month).
- **Pros:** Independence, choice of location, no curfew.
- **Cons:** High upfront cost (4–6 months rent), guarantor required (or guarantor company), Japanese contracts.
- **Search sites:** SUUMO, HOME'S, At Home, CHINTAI, GaijinPot Housing.

**3. Share Houses (シェアハウス)**
- **Cost:** ¥40,000–¥80,000/month (often includes utilities, Wi-Fi).
- **Pros:** Lower upfront cost, furnished, international community, flexible contracts (monthly).
- **Cons:** Shared kitchen/bathroom, less privacy, noise.
- **Providers:** Sakura House, Oakhouse, Social Residence, Borderless House, Hitotsuchi.

**4. Homestays (ホームステイ)**
- **Cost:** ¥60,000–¥100,000/month (includes 2 meals/day).
- **Pros:** Cultural immersion, Japanese practice, meals included, support.
- **Cons:** Less independence, house rules, commute may be longer.
- **Providers:** Japan Homestay Association, university-arranged programs.

**Timeline & Tips**
- **Start searching 3–6 months before arrival.**
- **Guarantor:** Most landlords require a Japanese guarantor. Use a guarantor company (ジェイリース, Nihon Safety, etc.) — fee ~50–100% of monthly rent.
- **Fire insurance:** Required (¥10,000–¥20,000/2 years), often arranged by agency.
- **Internet:** Often not included; contract separately (fiber: ¥4,000–¥6,000/month; pocket Wi-Fi: ¥3,000–¥5,000/month).
- **Moving in:** Take meter readings (electricity, gas, water), register at city hall within 14 days.

**Sources:** JASSO "Housing Guide", university international offices, real estate sites. **Last updated: November 2024.**`,
    category: 'Housing',
    imageUrl: null,
    sortOrder: 1
  },
  {
    id: 2,
    title: 'Cost of Living Breakdown',
    content: `Monthly expenses for international students in major Japanese cities (2024 estimates).

**Tokyo (23 wards)**
| Category | Monthly Cost (JPY) | Notes |
|----------|-------------------|-------|
| Rent (share house) | ¥55,000–¥80,000 | Private room, shared facilities |
| Rent (apartment) | ¥70,000–¥120,000 | 1R/1K, excluding key money/deposit |
| Food | ¥35,000–¥55,000 | Cooking at home + occasional eating out |
| Transport | ¥5,000–¥10,000 | Student commuter pass (teikiken) |
| Utilities | ¥8,000–¥15,000 | Electricity, gas, water, internet |
| Mobile phone | ¥3,000–¥5,000 | Major carrier or MVNO |
| Insurance (NHI) | ¥2,000–¥3,000 | National Health Insurance |
| Miscellaneous | ¥10,000–¥20,000 | Books, entertainment, clothes, etc. |
| **Total** | **¥118,000–¥208,000** | |

**Osaka / Kyoto / Kobe**
| Category | Monthly Cost (JPY) |
|----------|-------------------|
| Rent (share house) | ¥40,000–¥65,000 |
| Rent (apartment) | ¥50,000–¥85,000 |
| Food | ¥30,000–¥50,000 |
| Transport | ¥4,000–¥8,000 |
| Utilities | ¥7,000–¥12,000 |
| Mobile phone | ¥3,000–¥5,000 |
| Insurance (NHI) | ¥2,000–¥3,000 |
| Miscellaneous | ¥8,000–¥15,000 |
| **Total** | **¥97,000–¥173,000** |

**Fukuoka / Sapporo / Nagoya / Regional Cities**
| Category | Monthly Cost (JPY) |
|----------|-------------------|
| Rent (share house) | ¥35,000–¥55,000 |
| Rent (apartment) | ¥40,000–¥70,000 |
| Food | ¥28,000–¥45,000 |
| Transport | ¥3,000–¥7,000 |
| Utilities | ¥6,000–¥10,000 |
| Mobile phone | ¥3,000–¥5,000 |
| Insurance (NHI) | ¥1,500–¥2,500 |
| Miscellaneous | ¥7,000–¥12,000 |
| **Total** | **¥83,500–¥152,500** |

**University Dormitory (all cities)**
- **Total:** ¥40,000–¥70,000 (rent + utilities + internet often included)

**Upfront Costs (Apartment)**
- Key money (1–2 months rent) + Deposit (1–2 months) + Agency fee (1.1 months) + Guarantor fee (0.5–1 month) + Fire insurance + First month rent = **4–6 months' rent**.

**Money-Saving Tips**
- University cafeteria (学食): ¥300–¥600/meal.
- Supermarket discount hours (after 7–8 PM): 20–50% off.
- 100-yen shops (Daiso, Seria) for daily necessities.
- Student discounts: trains, museums, movies, software.
- MVNO (IIJmio, mineo, LINEMO): ¥1,000–¥3,000/month for data.

**Sources:** JASSO "Student Life Survey 2023", MEXT, Numbeo, city government data. **Last updated: November 2024.**`,
    category: 'Budget',
    imageUrl: null,
    sortOrder: 2
  },
  {
    id: 3,
    title: 'Part-Time Job Guide',
    content: `How to find and apply for part-time work (アルバイト, arubaito) as an international student in Japan.

**Legal Requirements**
- **Permission required:** Apply for "Permission to Engage in Activity Other Than That Permitted" at immigration (or on entry at airport).
- **Hours:** Max 28 hrs/week during term; 40 hrs/week during long vacations.
- **Prohibited:** Adult entertainment, gambling, jobs affecting studies.

**Popular Job Categories for Students**
1. **Convenience Store (コンビニ)** — ¥1,050–¥1,300/hr. Night shift pays 25% more (22:00–5:00). Shifts: 4–8 hrs. Japanese N3+ preferred.
2. **Restaurant / Café** — ¥1,050–¥1,400/hr + free meals (まかない). Hall (hall staff) or kitchen. Japanese N3+ for hall; N4+ for kitchen.
3. **English Teaching / Tutoring** — ¥1,500–¥3,500/hr. Eikaiwa, private tutoring, cram schools (juku). Native/near-native English. TEFL/TESOL helpful.
4. **Translation / Interpretation** — ¥2,000–¥5,000/hr. Business docs, games, anime, tourism. JLPT N2+ and specialized knowledge.
5. **IT / Engineering Intern** — ¥1,500–¥3,000/hr. Programming, QA, data entry. Portfolio/GitHub required.
6. **Hotel / Ryokan** — ¥1,100–¥1,500/hr. Front desk, cleaning, restaurant. Seasonal peaks (Golden Week, Obon, New Year).
7. **University TA / RA** — ¥1,200–¥2,000/hr. Grading, lab assistance, research. Ask professors directly.

**Where to Find Jobs**
- **University career center** — exclusive postings, vetted employers.
- **Job sites:** TownWork, Baitoru, Indeed Japan, GaijinPot Jobs, JobBox, Standby.
- **Apps:** Timee (single-shift gigs), Shotworks (short-term).
- **Physical:** Hello Work (public employment office) — foreigner support corners.

**Application Process**
1. **Resume (履歴書, rirekisho):** Japanese format (photo, education, work history, motivation). Handwritten preferred traditionally; typed accepted.
2. **Interview:** Usually 1–2 rounds. Basic Japanese questions (self-intro, availability, why this job).
3. **Documents for hiring:** Residence card, passport, bank account details, My Number, hanko (personal seal) or signature.

**Tax & Payroll**
- **Payday:** Typically 25th or end of month (cash or bank transfer).
- **Pay slip (給与明細):** Check hours, rate, deductions.
- **Year-end adjustment (年末調整):** Employer calculates tax; submit dependent/insurance forms.
- **Tax return (確定申告):** Required if multiple employers, side income > ¥200,000, or want refund.

**Red Flags**
- "No contract" or verbal-only agreement.
- Pay below minimum wage (check prefectural minimum: Tokyo ¥1,113/hr as of Oct 2024).
- Unpaid overtime, "training period" without pay.
- Pressure to work over 28 hrs/week.

**Sources:** Ministry of Health Labour and Welfare, JASSO, university career centers. **Last updated: November 2024.**`,
    category: 'Work',
    imageUrl: null,
    sortOrder: 3
  },
  {
    id: 4,
    title: 'Healthcare & Insurance',
    content: `National Health Insurance, clinics, and emergency care in Japan for international students.

**National Health Insurance (NHI / 国民健康保険, Kokumin Kenkō Hoken)**
- **Mandatory** for all residents staying >3 months (including students).
- **Covers 70%** of medical costs (you pay 30% at point of service).
- **Premium:** ~¥20,000–¥30,000/year for students (varies by city/ward, based on prior year income = ¥0 for new students).
- **Enrollment:** At city/ward office (市役所/区役所) within 14 days of address registration. Bring residence card, passport, student ID.
- **Insurance card (保険証, hokensho):** Issued same day or mailed. Carry it always.

**University Health Insurance (Optional Supplement)**
- Many universities offer **Gakkensai (学生教育研究災害傷害保険)** — covers injuries during classes, experiments, club activities, commuting.
- **Cost:** ~¥1,000–¥3,000/year. Highly recommended.
- Some universities have **mutual aid associations** (互助会) for additional coverage.

**Finding Medical Care**
- **Clinics (診療所, shinryōjo):** General practice, internal medicine, dermatology, etc. No referral needed. Small, neighborhood-based.
- **Hospitals (病院, byōin):** Larger, specialists, emergency. **Referral letter (紹介状, shōkaijō) from clinic often required** — without it, extra ¥5,000–¥10,000 "selection treatment fee."
- **English-speaking doctors:** Search "Foreigner-friendly clinic" + city name; embassies publish lists; international clinics in Tokyo/Osaka (e.g., Tokyo Medical Surgical Clinic, Osaka International Clinic).
- **Mental health:** University counseling centers (free/low cost); TELL Lifeline (03-5774-0992, English); local mental health clinics.

**Emergency**
- **Ambulance:** Dial **119** (free). Operator speaks Japanese; say "English please" for interpreter.
- **Emergency hospitals:** Accept patients 24/7. Bring insurance card + residence card + cash (¥20,000+ for deposit).
- **After-hours clinics:** Weekend/night clinics (休日夜間急患センター) in each city.

**Pharmacies (薬局, yakkyoku)**
- Present prescription (処方箋, shohōsen) from doctor.
- 70% covered by NHI; you pay 30%.
- Over-the-counter drugs available without prescription (painkillers, cold medicine, etc.).

**Dental & Vision**
- **Dental:** Covered by NHI (70%). Orthodontics, implants, whitening not covered.
- **Vision:** Eye exams not covered; glasses/contacts not covered. Some university plans offer discounts.

**Medical Certificates for University**
- **Sick leave:** Visit clinic → get "Medical Certificate" (診断書, shindansho) — ¥3,000–¥5,000, submit to university.
- **Vaccination records:** Keep for enrollment, dormitory, part-time jobs.

**Sources:** Ministry of Health Labour and Welfare, NHI guides, university health centers. **Last updated: November 2024.**`,
    category: 'Health',
    imageUrl: null,
    sortOrder: 4
  },
  {
    id: 5,
    title: 'Japanese Language Schools',
    content: `Choosing a Japanese language school before or during university.

**Why Attend a Language School?**
- **University preparation:** Most Japanese-taught degrees require JLPT N2/N1.
- **Visa pathway:** Student visa for language school (1–2 years) → university.
- **Cultural adaptation:** Daily life skills, networking, part-time job access.
- **EJU preparation:** Structured curriculum for Examination for Japanese University Admission.

**Types of Schools**
1. **University-affiliated** (e.g., Waseda, Keio, Sophia, Tokyo University of Foreign Studies) — direct entry pathways, higher cost.
2. **Specialized training colleges (専門学校, senmon gakkō)** — vocational + Japanese, some offer university prep courses.
3. **Independent language schools** — wide range of prices, schedules, locations. Accredited by JASSO/Association for Promotion of Japanese Language Education.

**Key Selection Criteria**
- **Accreditation:** JASSO-recognized / "Appropriate School" (適正校) — faster COE processing, visa renewal easier.
- **Curriculum:** JLPT-focused, EJU-focused, balanced, or conversation-focused.
- **Class size:** 10–20 students ideal.
- **Student support:** Visa assistance, housing, university counseling, job support.
- **Location:** Tokyo (most options, high cost), Osaka, Fukuoka, Sapporo, regional (lower cost, fewer English speakers).
- **Intake:** April (1–2 years), July (1.5 years), October (1–2 years), January (1.5 years).

**Costs (1 Year)**
- **Tuition:** ¥600,000–¥900,000.
- **Fees:** Admission ¥50,000–¥100,000, materials ¥30,000–¥50,000, facilities ¥20,000–¥50,000.
- **Total first year:** ¥700,000–¥1,100,000.
- **Living costs:** Add ¥1,000,000–¥1,500,000/year.

**University Admission from Language School**
- **Designated School Recommendation (指定校推薦):** Partner universities reserve slots for language school graduates.
- **EJU + University Exam:** Standard route.
- **AO Admission (入試):** Portfolio, interview, essay — some universities accept language school students.

**Recommended Schools (Examples)**
- **Tokyo:** ISI, ARC Academy, KAI, Shinjuku Japanese Language Institute, Tokyo Central Japanese Language School.
- **Osaka:** Osaka YMCA, J International School, Communica Institute.
- **Fukuoka:** Genki Japanese & Culture School, Fukuoka International School of Language.
- **Online options:** Nihongo Master, Attain Online Japanese, university-affiliated online prep.

**Red Flags**
- Unaccredited schools (visa issues, no university pathways).
- Guaranteed admission promises (unrealistic).
- No transparent fee breakdown.
- Poor reviews on Google Maps, GaijinPot, Reddit.

**Sources:** JASSO, Association for Promotion of Japanese Language Education, MEXT. **Last updated: November 2024.**`,
    category: 'Language',
    imageUrl: null,
    sortOrder: 5
  }
]
writeFileSync(join(GUIDES_DIR, 'student-life.json'), JSON.stringify(studentLifeArticles, null, 2))

console.log('Wrote guides: admission, visa, student-life')

// --- Summary ---
const indexSize = statSync(indexPath).size
console.log('\n✅ Build complete!')
console.log(`  - ${index.length} universities (index + detail files)`)
console.log(`  - universities-index.json: ${(indexSize / 1024).toFixed(1)} KB (${indexSize} bytes)`)
console.log(`  - ${cities.length} cities`)
console.log(`  - ${scholarships.length} scholarships`)
console.log(`  - ${admissionGuides.length} admission guides`)
console.log(`  - ${visaGuides.length} visa guides`)
console.log(`  - ${studentLifeArticles.length} student life articles`)