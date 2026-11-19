import { universityListQuerySchema } from './university-validation'
import { findUniversities } from './data'

export type University = {
  id: number
  name: string
  description: string | null
  ranking: number | null
  tuitionFeeYearly: string | null
  programs: string | null
  websiteUrl: string | null
  sourceUrl: string | null
  images: string[]
  cityName: string | null
  cityId: number | null
  costOfLivingMonthly: number | null
  institutionType: string | null
  faculty: string | null
  degree: string | null
  intake: string | null
  mediumOfInstruction: string | null
  preArrivalAdmission: string | null
  majorSpeciality: string | null
  ieltsRequirement: number | null
  jlptRequirement: string | null
  programCount: number | null
  favorited: boolean
  averageRating: number | null
  reviewCount: number
}

export async function listUniversitiesServer(params: URLSearchParams) {
  const raw = Object.fromEntries(params.entries())
  const query = universityListQuerySchema.parse(raw)
  
  const filters = {
    search: query.search || undefined,
    cityId: query.cityId,
    maxTuition: query.maxTuition,
    minRanking: query.minRanking,
    institutionType: query.institutionType || undefined,
    mediumOfInstruction: query.mediumOfInstruction || undefined,
    preArrivalAdmission: query.preArrivalAdmission || undefined,
    intake: query.intake || undefined,
  }
  
  const pagination = { page: query.page, size: query.size }
  
  return findUniversities(filters, pagination)
}