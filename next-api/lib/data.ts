import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const DATA_DIR = join(process.cwd(), 'data')
const UNIV_DIR = join(DATA_DIR, 'universities')

// In-memory cache for index
let universitiesIndexCache: UniversityIndex[] | null = null
let citiesCache: City[] | null = null
let scholarshipsCache: Scholarship[] | null = null
const guidesCache: Record<string, Guide[] | null> = { admission: null, visa: null, 'student-life': null }

type City = {
  id: number
  name: string
  description: string | null
  costOfLivingMonthly: number | null
  imageUrl: string | null
}

type Scholarship = {
  id: number
  title: string
  description: string | null
  amountYearly: string | null
  coverage: string | null
  deadlineMonth: string | null
  eligibility: string | null
  universityId: number | null
}

type Guide = {
  id: number
  title: string
  content: string
  category: string | null
  sortOrder: number
  visaType?: string | null
  imageUrl?: string | null
}

type UniversityIndex = {
  id: number
  sourceKey: string
  name: string
  cityName: string | null
  cityId: number | null
  ranking: number | null
  tuitionFeeYearly: number | null
  institutionType: string | null
  programs: string | null
  intake: string | null
  mediumOfInstruction: string | null
  preArrivalAdmission: string | null
  images: string[]
  degree: string | null
  faculty: string | null
  majorSpeciality: string | null
  websiteUrl: string | null
  sourceUrl: string | null
  ieltsRequirement: number | null
  jlptRequirement: string | null
}

function loadIndex() {
  if (!universitiesIndexCache) {
    const data = readFileSync(join(DATA_DIR, 'universities-index.json'), 'utf-8')
    universitiesIndexCache = JSON.parse(data)
  }
  return universitiesIndexCache
}

function loadCities() {
  if (!citiesCache) {
    const data = readFileSync(join(DATA_DIR, 'cities.json'), 'utf-8')
    citiesCache = JSON.parse(data)
  }
  return citiesCache
}

function loadScholarships() {
  if (!scholarshipsCache) {
    const data = readFileSync(join(DATA_DIR, 'scholarships.json'), 'utf-8')
    scholarshipsCache = JSON.parse(data)
  }
  return scholarshipsCache
}

function loadGuides(type: string) {
  if (!guidesCache[type]) {
    const data = readFileSync(join(DATA_DIR, 'guides', `${type}.json`), 'utf-8')
    guidesCache[type] = JSON.parse(data)
  }
  return guidesCache[type]
}

function loadUniversity(id: number) {
  const data = readFileSync(join(UNIV_DIR, `${id}.json`), 'utf-8')
  return JSON.parse(data)
}

// Filter functions (in-memory, fast)
type UniversityFilters = {
  search?: string
  cityId?: number
  maxTuition?: number
  minRanking?: number
  institutionType?: string
  mediumOfInstruction?: string
  preArrivalAdmission?: string
  intake?: string
}

function filterUniversities(universities: UniversityIndex[], filters: UniversityFilters) {
  return universities.filter((u) => {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      const haystack = [
        u.name,
        u.programs,
        u.faculty,
        u.degree,
        u.majorSpeciality,
        u.institutionType,
        u.intake,
        u.mediumOfInstruction,
        u.preArrivalAdmission,
      ].filter(Boolean).join(' ').toLowerCase()
      if (!haystack.includes(search)) return false
    }
    if (filters.cityId !== undefined && u.cityId !== filters.cityId) return false
    if (filters.maxTuition !== undefined && u.tuitionFeeYearly !== null && u.tuitionFeeYearly > filters.maxTuition) return false
    if (filters.minRanking !== undefined && u.ranking !== null && u.ranking < filters.minRanking) return false
    if (filters.institutionType && u.institutionType?.toLowerCase() !== filters.institutionType.toLowerCase()) return false
    if (filters.mediumOfInstruction && u.mediumOfInstruction?.toLowerCase() !== filters.mediumOfInstruction.toLowerCase()) return false
    if (filters.preArrivalAdmission && u.preArrivalAdmission?.toLowerCase() !== filters.preArrivalAdmission.toLowerCase()) return false
    if (filters.intake && u.intake?.toLowerCase() !== filters.intake.toLowerCase()) return false
    return true
  })
}

function sortUniversities(universities: UniversityIndex[]) {
  return [...universities].sort((a, b) => {
    // Ranked first (ascending), then by name
    if (a.ranking !== null && b.ranking !== null) return a.ranking - b.ranking
    if (a.ranking !== null) return -1
    if (b.ranking !== null) return 1
    return a.name.localeCompare(b.name)
  })
}

export function getUniversitiesIndex() {
  return loadIndex()
}

export function getUniversityById(id: number) {
  try {
    return loadUniversity(id)
  } catch {
    return null
  }
}

export function getCities() {
  return loadCities()
}

export function getScholarships() {
  return loadScholarships()
}

export function getGuides(type: string) {
  return loadGuides(type)
}

export function findUniversities(filters = {}, pagination = { page: 0, size: 12 }) {
  const all = getUniversitiesIndex() ?? []
  const filtered = filterUniversities(all, filters)
  const sorted = sortUniversities(filtered)
  const totalElements = sorted.length
  const totalPages = Math.ceil(totalElements / pagination.size)
  const data = sorted.slice(pagination.page * pagination.size, (pagination.page + 1) * pagination.size)
  // Add computed fields for compatibility with University type
  const dataWithComputed = data.map((u) => ({
    ...u,
    favorited: false,
    averageRating: null,
    reviewCount: 0,
  }))
  return { data: dataWithComputed, meta: { page: pagination.page, size: pagination.size, totalElements, totalPages } }
}

export function findUniversityById(id: number) {
  const uni = getUniversityById(id)
  if (!uni) return null
  // Add computed fields for compatibility
  return {
    ...uni,
    favorited: false,
    averageRating: null,
    reviewCount: 0,
  }
}

export function findUniversitiesByIds(ids: number[]) {
  return ids.map((id) => getUniversityById(id)).filter(Boolean)
}

type MatchInput = {
  field?: string
  budgetYearly?: number | null
  ieltsScore?: number | null
  jlptLevel?: string | null
  cityId?: number | null
}

export function matchUniversities(input: MatchInput) {
  const all = getUniversitiesIndex() ?? []
  return all
    .map((uni) => scoreUniversity(uni, input))
    .sort((a, b) => b.score - a.score || (a.university.ranking ?? 999999) - (b.university.ranking ?? 999999))
    .slice(0, 5)
}

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() || ''
}

function scoreUniversity(university: UniversityIndex, input: MatchInput) {
  let value = 35
  const reasons = []
  const gaps = []
  const programs = normalize(university.programs)
  const field = normalize(input.field)
  const tuition = university.tuitionFeeYearly ? Number(university.tuitionFeeYearly) : null

  if (input.budgetYearly != null && tuition != null) {
    if (input.budgetYearly >= tuition) { value += 20; reasons.push('Tuition fits your yearly budget.') }
    else { value -= 18; gaps.push('Tuition is above your yearly budget.') }
  }
  if (input.ieltsScore != null && university.ieltsRequirement != null) {
    if (input.ieltsScore >= university.ieltsRequirement) { value += 18; reasons.push('Your IELTS score meets the listed requirement.') }
    else if (input.ieltsScore + 0.5 >= university.ieltsRequirement) { value += 4; gaps.push('IELTS is close to the listed requirement.') }
    else { value -= 14; gaps.push('IELTS is below the listed requirement.') }
  }
  if (field) {
    const related = programs.includes(field) ||
      (field.includes('computer') && /(computer|engineering|science)/.test(programs)) ||
      (field.includes('business') && /(business|commerce|economics|management)/.test(programs)) ||
      (field.includes('medicine') && /(medicine|dentistry|life science)/.test(programs))
    if (related) { value += 22; reasons.push('Programs are related to your study interest.') }
    else { value -= 6; gaps.push('Programs may not directly match your study interest.') }
  }
  if (input.jlptLevel && university.jlptRequirement) {
    const rank = (level: string) => ({ n1: 1, n2: 2, n3: 3, n4: 4, n5: 5 }[normalize(level)] || 0)
    if (rank(input.jlptLevel) > 0 && rank(input.jlptLevel) <= rank(university.jlptRequirement)) { value += 10; reasons.push('Your JLPT level meets the listed requirement.') }
    else { value -= 6; gaps.push('JLPT may need improvement for Japanese-taught programs.') }
  }
  if (input.cityId != null && university.cityId != null) {
    if (input.cityId === university.cityId) { value += 8; reasons.push('Located in your preferred city.') }
    else value -= 2
  }
  if (university.ranking != null && university.ranking <= 70) { value += 6; reasons.push('Strong ranking among listed universities.') }
  value = Math.max(0, Math.min(100, value))
  return {
    university: { ...university, favorited: false, averageRating: null, reviewCount: 0 },
    score: value,
    fitLevel: value >= 78 ? 'Excellent fit' : value >= 60 ? 'Good fit' : value >= 42 ? 'Possible fit' : 'Stretch option',
    reasons,
    gaps,
  }
}
