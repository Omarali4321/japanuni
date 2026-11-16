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
  favorited: boolean
  averageRating: number | null
  reviewCount: number
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error?.message || 'Request failed')
  return body.data ?? body
}

export async function listUniversities(params: URLSearchParams) {
  const response = await fetch(`/api/universities?${params.toString()}`, { cache: 'no-store' })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error?.message || 'Could not load universities')
  return body as { data: University[]; meta: { page: number; size: number; totalElements: number; totalPages: number } }
}

export function getUniversity(id: string) {
  return get<University>(`/api/universities/${id}`)
}

export function getReviews(id: string) {
  return get<Array<{ id: number; rating: number; comment: string | null; userName: string; createdAt: string }>>(`/api/universities/${id}/reviews`)
}

export function compareUniversities(ids: number[]) {
  return fetch('/api/universities/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ universityIds: ids }),
  }).then(async (response) => {
    const body = await response.json()
    if (!response.ok) throw new Error(body.error?.message || 'Could not compare universities')
    return body.data as University[]
  })
}

export function listScholarships(params: URLSearchParams) {
  return fetch(`/api/scholarships?${params.toString()}`, { cache: 'no-store' }).then(async (response) => {
    const body = await response.json()
    if (!response.ok) throw new Error(body.error?.message || 'Could not load scholarships')
    return body as { data: Array<Record<string, unknown>>; meta: { page: number; size: number; totalElements: number; totalPages: number } }
  })
}

export function listContent(path: string) {
  return get<Array<Record<string, unknown>>>(path)
}
