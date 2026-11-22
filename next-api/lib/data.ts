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
  programCount: number | null
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
    if (filters.mediumOfInstruction) {
      if (!matchesLanguageFilter(u.mediumOfInstruction, filters.mediumOfInstruction)) return false
    }
    if (filters.preArrivalAdmission) {
      const filterVal = filters.preArrivalAdmission.toLowerCase()
      const uniVal = normalizePreArrivalForFilter(u.preArrivalAdmission)
      if (filterVal !== uniVal) return false
    }
    if (filters.intake) {
      const filterVal = filters.intake.toLowerCase()
      const uniVal = normalizeIntakeForFilter(u.intake)
      if (filterVal !== uniVal) return false
    }
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

function normalizeLanguageForFilter(lang: string | null | undefined): string {
  if (!lang) return ''
  const lower = lang.toLowerCase()
  const hasJapanese = lower.includes('japanese')
  const hasEnglish = lower.includes('english')
  if (hasJapanese && hasEnglish) return 'both'
  if (hasJapanese) return 'japanese'
  if (hasEnglish) return 'english'
  return 'both'
}

function matchesLanguageFilter(uniLang: string | null, filterLang: string): boolean {
  if (!filterLang) return true
  if (!uniLang) return false
  const filter = filterLang.toLowerCase()
  const normalizedUni = normalizeLanguageForFilter(uniLang)
  
  // Filter values from UI: 'Japanese (100%)', 'English (100%)', 'Both'
  if (filter === 'japanese (100%)') return normalizedUni === 'japanese'
  if (filter === 'english (100%)') return normalizedUni === 'english'
  if (filter === 'both') return normalizedUni === 'both'
  return true
}

function normalizeIntakeForFilter(intake: string | null | undefined): string {
  if (!intake) return ''
  const lower = intake.toLowerCase()
  const hasApril = lower.includes('april')
  const hasOctober = lower.includes('october')
  const hasSeptember = lower.includes('september')
  if (hasApril && !hasOctober && !hasSeptember) return 'april'
  if (hasOctober && !hasApril && !hasSeptember) return 'october'
  if (hasSeptember && !hasApril && !hasOctober) return 'september'
  return 'other'
}

function normalizePreArrivalForFilter(pre: string | null | undefined): string {
  if (!pre) return ''
  const lower = pre.toLowerCase()
  const hasYes = lower.includes('yes')
  const hasNo = lower.includes('no')
  if (hasYes && !hasNo) return 'yes'
  if (hasNo && !hasYes) return 'no'
  return ''
}

function scoreUniversity(university: UniversityIndex, input: MatchInput) {
  let value = 30
  const reasons: string[] = []
  const gaps: string[] = []

  const programs = normalize(university.programs)
  const majorSpeciality = normalize(university.majorSpeciality)
  const faculty = normalize(university.faculty)
  const field = normalize(input.field)
  const tuition = university.tuitionFeeYearly ? Number(university.tuitionFeeYearly) : null
  const allProgramText = [programs, majorSpeciality, faculty].filter(Boolean).join(' ')

  // 1. Field of study match (most important factor)
  if (field) {
    const fieldScore = calculateFieldMatch(field, allProgramText)
    value += fieldScore.score
    reasons.push(...fieldScore.reasons)
    gaps.push(...fieldScore.gaps)
  }

  // 2. Budget match (if both provided)
  if (input.budgetYearly != null && tuition != null) {
    if (input.budgetYearly >= tuition) {
      value += 15
      reasons.push(`Tuition ¥${tuition.toLocaleString()}/year fits your budget (¥${input.budgetYearly.toLocaleString()}).`)
    } else {
      value -= 10
      gaps.push(`Tuition ¥${tuition.toLocaleString()}/year exceeds your budget (¥${input.budgetYearly.toLocaleString()}).`)
    }
  } else if (input.budgetYearly != null) {
    gaps.push('Tuition data not available for this university.')
  }

  // 3. IELTS match
  if (input.ieltsScore != null && university.ieltsRequirement != null) {
    if (input.ieltsScore >= university.ieltsRequirement) {
      value += 12
      reasons.push(`Your IELTS ${input.ieltsScore} meets requirement (${university.ieltsRequirement}).`)
    } else if (input.ieltsScore + 0.5 >= university.ieltsRequirement) {
      value += 5
      gaps.push(`IELTS ${input.ieltsScore} is close to requirement (${university.ieltsRequirement}).`)
    } else {
      value -= 8
      gaps.push(`IELTS ${input.ieltsScore} below requirement (${university.ieltsRequirement}).`)
    }
  } else if (input.ieltsScore != null) {
    gaps.push('IELTS requirement data not available.')
  }

  // 4. JLPT match
  if (input.jlptLevel && university.jlptRequirement) {
    const rank = (level: string) => ({ n1: 1, n2: 2, n3: 3, n4: 4, n5: 5 }[normalize(level)] || 0)
    const userRank = rank(input.jlptLevel)
    const reqRank = rank(university.jlptRequirement)
    if (userRank > 0 && userRank <= reqRank) {
      value += 10
      reasons.push(`Your JLPT ${input.jlptLevel.toUpperCase()} meets requirement (${university.jlptRequirement.toUpperCase()}).`)
    } else {
      value -= 5
      gaps.push(`JLPT ${input.jlptLevel.toUpperCase()} may need improvement for requirement (${university.jlptRequirement.toUpperCase()}).`)
    }
  } else if (input.jlptLevel) {
    gaps.push('JLPT requirement data not available.')
  }

  // 5. Language of instruction match
  if (input.ieltsScore != null || input.jlptLevel) {
    const langMatch = calculateLanguageMatch(university.mediumOfInstruction, input.ieltsScore ?? null, input.jlptLevel ?? null)
    value += langMatch.score
    reasons.push(...langMatch.reasons)
    gaps.push(...langMatch.gaps)
  }

  // 6. Institution type preference (national/public often preferred)
  if (university.institutionType === 'National') {
    value += 5
    reasons.push('National university — typically lower tuition and high reputation.')
  } else if (university.institutionType === 'Public') {
    value += 3
    reasons.push('Public university — often good value.')
  }

  // 7. Program breadth (more programs = more options)
  if (university.programCount && university.programCount > 10) {
    value += 3
    reasons.push(`${university.programCount} programs available — broad choice.`)
  } else if (university.programCount && university.programCount <= 3) {
    gaps.push(`Only ${university.programCount} program(s) — limited options.`)
  }

  // 8. Ranking bonus (if available)
  if (university.ranking != null && university.ranking <= 50) {
    value += 5
    reasons.push(`Ranked #${university.ranking} in Japan.`)
  }

  // 9. Pre-arrival admission availability (bonus if offered)
  if (university.preArrivalAdmission && university.preArrivalAdmission.toLowerCase().includes('yes')) {
    value += 2
    reasons.push('Offers pre-arrival admission.')
  }

  // 10. English-taught programs percentage bonus
  const lang = normalize(university.mediumOfInstruction)
  if (lang.includes('english (100%)')) {
    value += 3
    reasons.push('Fully English-taught programs available.')
  } else if (lang.includes('english') && lang.includes('japanese')) {
    value += 1
    reasons.push('Both English and Japanese instruction available.')
  }

  // 11. City preference (if available)
  if (input.cityId != null && university.cityId != null) {
    if (input.cityId === university.cityId) {
      value += 5
      reasons.push('Located in your preferred city.')
    }
  }

  // 12. Tie-breaker: slight preference for more programs (consistent ordering)
  if (university.programCount && university.programCount > 0) {
    value += Math.min(2, university.programCount / 100)
  }

  value = Math.max(0, Math.min(100, value))
  return {
    university: { ...university, favorited: false, averageRating: null, reviewCount: 0 },
    score: value,
    fitLevel: value >= 75 ? 'Excellent fit' : value >= 55 ? 'Good fit' : value >= 35 ? 'Possible fit' : 'Stretch option',
    reasons: reasons.length > 0 ? reasons : ['Limited data available for detailed matching.'],
    gaps,
  }
}

function calculateFieldMatch(field: string, programText: string) {
  const score = { score: 0, reasons: [] as string[], gaps: [] as string[] }
  const fieldWords = field.split(/\s+/).filter(w => w.length > 2)
  
  // Direct match
  if (programText.includes(field)) {
    score.score += 25
    score.reasons.push(`Programs directly match "${field}".`)
    return score
  }

  // Keyword-based matching for common fields
  const fieldMappings: Record<string, string[]> = {
    'computer': ['computer', 'information', 'software', 'data science', 'ai', 'artificial intelligence', 'informatics', 'computing'],
    'engineering': ['engineering', 'mechanical', 'electrical', 'electronic', 'civil', 'chemical', 'materials', 'robotics'],
    'business': ['business', 'commerce', 'economics', 'management', 'finance', 'accounting', 'marketing', 'mba'],
    'medicine': ['medicine', 'medical', 'dentistry', 'pharmacy', 'nursing', 'health', 'clinical', 'life science', 'biomedical'],
    'science': ['science', 'physics', 'chemistry', 'biology', 'mathematics', 'mathematical'],
    'law': ['law', 'legal', 'political'],
    'arts': ['arts', 'humanities', 'literature', 'language', 'linguistics', 'history', 'philosophy', 'culture'],
    'education': ['education', 'teaching', 'pedagogy'],
    'agriculture': ['agriculture', 'agricultural', 'bioresource', 'forestry', 'fisheries'],
    'social': ['social', 'sociology', 'psychology', 'welfare', 'policy', 'international relations'],
    'environment': ['environment', 'environmental', 'sustainability', 'energy'],
  }

  let bestMatch = 0
  let matchedCategory = ''
  for (const [category, keywords] of Object.entries(fieldMappings)) {
    if (field.includes(category) || keywords.some(k => field.includes(k))) {
      const matches = keywords.filter(k => programText.includes(k)).length
      if (matches > bestMatch) {
        bestMatch = matches
        matchedCategory = category
      }
    }
  }

  if (bestMatch > 0) {
    score.score += Math.min(20, 10 + bestMatch * 3)
    score.reasons.push(`Programs relate to ${matchedCategory} (${bestMatch} keyword match${bestMatch > 1 ? 'es' : ''}).`)
  } else {
    // Check individual field words
    const wordMatches = fieldWords.filter(w => programText.includes(w)).length
    if (wordMatches > 0) {
      score.score += wordMatches * 3
      score.reasons.push(`${wordMatches} keyword${wordMatches > 1 ? 's' : ''} from your interest found in programs.`)
    } else {
      score.score -= 5
      score.gaps.push('Programs may not directly match your study interest.')
    }
  }
  return score
}

function calculateLanguageMatch(mediumOfInstruction: string | null, ieltsScore: number | null, jlptLevel: string | null) {
  const score = { score: 0, reasons: [] as string[], gaps: [] as string[] }
  if (!mediumOfInstruction) return score

  const lang = mediumOfInstruction.toLowerCase()
  const hasJapanese = lang.includes('japanese')
  const hasEnglish = lang.includes('english')

  if (hasJapanese && hasEnglish) {
    score.score += 5
    score.reasons.push('Programs offered in both Japanese and English.')
  } else if (hasEnglish && ieltsScore != null) {
    score.score += 5
    score.reasons.push('English-taught programs available.')
  } else if (hasJapanese && jlptLevel) {
    score.score += 5
    score.reasons.push('Japanese-taught programs available.')
  } else if (hasJapanese && ieltsScore != null) {
    score.gaps.push('Primarily Japanese-taught; English programs may be limited.')
  } else if (hasEnglish && jlptLevel) {
    score.gaps.push('Primarily English-taught; Japanese programs may be limited.')
  }
  return score
}
