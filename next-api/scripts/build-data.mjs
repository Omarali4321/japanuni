#!/usr/bin/env node
/**
 * Build script: generates static JSON data files from CSV and Prisma seed data.
 * Runs in prebuild so Vercel builds data at deploy time.
 * No new dependencies — uses Node built-ins + existing csv-parse, iconv-lite.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
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

// --- CSV Parsing (same logic as import script) ---
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
  const majorValues = schoolRows.flatMap((row) => [
    row[headers.major1],
    row[headers.major2],
    row[headers.speciality],
  ])
  const urls = uniqueValues(schoolRows.map((row) => row[headers.url]))

  return {
    id: index + 1, // 1-based stable ID
    sourceKey: key,
    name: normalize(first[headers.school]),
    programs: joinValues(majorValues),
    websiteUrl: urls[0]?.slice(0, 500) || null,
    sourceDataset: 'School_Search_Result.csv',
    sourceUrl: urls[0]?.slice(0, 1000) || null,
    institutionType: joinValues(schoolRows.map((row) => row[headers.type])),
    faculty: joinValues(schoolRows.map((row) => row[headers.faculty])),
    degree: joinValues(schoolRows.map((row) => row[headers.degree])),
    intake: joinValues(schoolRows.flatMap((row) => [
      row[headers.begins1],
      row[headers.begins2],
    ])),
    mediumOfInstruction: joinValues(schoolRows.map((row) => row[headers.medium])),
    preArrivalAdmission: joinValues(schoolRows.map((row) => row[headers.preArrival])),
    majorSpeciality: joinValues(schoolRows.map((row) => row[headers.speciality])),
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
const indexFields = [
  'id', 'sourceKey', 'name', 'cityName', 'cityId',
  'ranking', 'tuitionFeeYearly', 'institutionType',
  'programs', 'intake', 'mediumOfInstruction',
  'preArrivalAdmission', 'images', 'degree', 'faculty',
  'majorSpeciality', 'websiteUrl', 'sourceUrl',
]

const index = records.map((r) => {
  const entry = {}
  for (const field of indexFields) {
    entry[field] = r[field]
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
const scholarships = [
  { id: 1, title: 'MEXT Scholarship', description: 'Japanese Government Scholarship for international students', amountYearly: '1440000', coverage: 'Full', deadlineMonth: 'May', eligibility: 'Undergraduate, Masters, PhD', universityId: null },
  { id: 2, title: 'JASSO Honors Scholarship', description: 'Monthly stipend for privately financed international students', amountYearly: '576000', coverage: 'Partial', deadlineMonth: 'Varies', eligibility: 'Undergraduate, Graduate', universityId: null },
  { id: 3, title: 'ADB-Japan Scholarship', description: 'Asian Development Bank scholarship for development studies', amountYearly: '2000000', coverage: 'Full', deadlineMonth: 'March', eligibility: 'Masters', universityId: null },
  { id: 4, title: 'Rotary Yoneyama Memorial', description: 'Scholarship for international students in Japan', amountYearly: '1200000', coverage: 'Partial', deadlineMonth: 'October', eligibility: 'Undergraduate, Graduate', universityId: null },
  { id: 5, title: 'University of Tokyo Fellowship', description: 'Merit-based fellowship for graduate students', amountYearly: '1500000', coverage: 'Full', deadlineMonth: 'January', eligibility: 'Masters, PhD', universityId: 1 },
  { id: 6, title: 'Kyoto University Scholarship', description: 'Support for outstanding international students', amountYearly: '1200000', coverage: 'Partial', deadlineMonth: 'February', eligibility: 'All levels', universityId: 2 },
]
writeFileSync(join(DATA_DIR, 'scholarships.json'), JSON.stringify(scholarships, null, 2))
console.log(`Wrote ${scholarships.length} scholarships to ${DATA_DIR}/scholarships.json`)

// --- Generate Guides (static reference data) ---
const admissionGuides = [
  { id: 1, title: 'Undergraduate Application Process', content: 'Step-by-step guide for applying to Japanese universities as an undergraduate...', category: 'Undergraduate', sortOrder: 1 },
  { id: 2, title: 'Graduate School Application Guide', content: 'How to apply for Master\'s and PhD programs in Japan...', category: 'Graduate', sortOrder: 2 },
  { id: 3, title: 'EJU Examination Guide', content: 'Everything you need to know about the Examination for Japanese University Admission...', category: 'Exams', sortOrder: 3 },
  { id: 4, title: 'Document Preparation Checklist', content: 'Complete checklist of required documents for university applications...', category: 'Documents', sortOrder: 4 },
]
writeFileSync(join(GUIDES_DIR, 'admission.json'), JSON.stringify(admissionGuides, null, 2))

const visaGuides = [
  { id: 1, title: 'Student Visa (COE) Application', content: 'Complete guide to obtaining a Certificate of Eligibility and student visa...', visaType: 'Student', sortOrder: 1 },
  { id: 2, title: 'Visa Extension & Renewal', content: 'How to extend or renew your student visa in Japan...', visaType: 'Student', sortOrder: 2 },
  { id: 3, title: 'Work Permission for Students', content: 'Rules for part-time work on a student visa (28 hours/week)...', visaType: 'Student', sortOrder: 3 },
  { id: 4, title: 'Post-Graduation Work Visa', content: 'Transitioning from student visa to work visa after graduation...', visaType: 'Work', sortOrder: 4 },
]
writeFileSync(join(GUIDES_DIR, 'visa.json'), JSON.stringify(visaGuides, null, 2))

const studentLifeArticles = [
  { id: 1, title: 'Finding Accommodation in Japan', content: 'Dormitories, share houses, and apartments — pros and cons...', category: 'Housing', imageUrl: null, sortOrder: 1 },
  { id: 2, title: 'Cost of Living Breakdown', content: 'Monthly expenses for students in major Japanese cities...', category: 'Budget', imageUrl: null, sortOrder: 2 },
  { id: 3, title: 'Part-Time Job Guide', content: 'How to find and apply for part-time work as an international student...', category: 'Work', imageUrl: null, sortOrder: 3 },
  { id: 4, title: 'Healthcare & Insurance', content: 'National Health Insurance, clinics, and emergency care in Japan...', category: 'Health', imageUrl: null, sortOrder: 4 },
  { id: 5, title: 'Japanese Language Schools', content: 'Choosing a language school before or during university...', category: 'Language', imageUrl: null, sortOrder: 5 },
]
writeFileSync(join(GUIDES_DIR, 'student-life.json'), JSON.stringify(studentLifeArticles, null, 2))

console.log('Wrote guides: admission, visa, student-life')

// --- Summary ---
console.log('\n✅ Build complete!')
console.log(`  - ${index.length} universities (index + detail files)`)
console.log(`  - ${cities.length} cities`)
console.log(`  - ${scholarships.length} scholarships`)
console.log(`  - ${admissionGuides.length} admission guides`)
console.log(`  - ${visaGuides.length} visa guides`)
console.log(`  - ${studentLifeArticles.length} student life articles`)