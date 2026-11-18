import { NextRequest } from 'next/server'
import { handleRouteError, jsonList } from '../../../lib/http'
import { getScholarships } from '../../../lib/data'
import { scholarshipQuerySchema } from '../../../lib/content-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const query = scholarshipQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    )
    let scholarships = getScholarships() ?? []

    if (query.search) {
      const search = query.search.toLowerCase()
      scholarships = scholarships.filter((s: { title: string; description?: string | null }) =>
        s.title.toLowerCase().includes(search) ||
        s.description?.toLowerCase().includes(search)
      )
    }
    if (query.universityId) {
      scholarships = scholarships.filter((s: { universityId: number | null }) => s.universityId === query.universityId)
    }

    const totalElements = scholarships.length
    const totalPages = Math.ceil(totalElements / query.size)
    const data = scholarships.slice(query.page * query.size, (query.page + 1) * query.size)
    return jsonList(data, { page: query.page, size: query.size, totalElements, totalPages })
  } catch (error) {
    return handleRouteError(error)
  }
}
