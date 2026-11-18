import { NextRequest } from 'next/server'
import { handleRouteError, jsonList } from '../../../lib/http'
import { getCities } from '../../../lib/data'
import { paginationSchema } from '../../../lib/content-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const query = paginationSchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))
    const cities = getCities() ?? []
    const totalElements = cities.length
    const totalPages = Math.ceil(totalElements / query.size)
    const data = cities.slice(query.page * query.size, (query.page + 1) * query.size)
    return jsonList(data, { page: query.page, size: query.size, totalElements, totalPages })
  } catch (error) {
    return handleRouteError(error)
  }
}
