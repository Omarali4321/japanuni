import { NextRequest } from 'next/server'
import { handleRouteError, jsonList } from '../../../lib/http'
import { findUniversities } from '../../../lib/data'
import { universityListQuerySchema } from '../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const raw = Object.fromEntries(request.nextUrl.searchParams.entries())
    const query = universityListQuerySchema.parse(raw)

    const result = findUniversities(
      {
        search: query.search || undefined,
        cityId: query.cityId,
        maxTuition: query.maxTuition,
        minRanking: query.minRanking,
        institutionType: query.institutionType || undefined,
        mediumOfInstruction: query.mediumOfInstruction || undefined,
        preArrivalAdmission: query.preArrivalAdmission || undefined,
        intake: query.intake || undefined,
      },
      { page: query.page, size: query.size }
    )

    return jsonList(result.data, result.meta)
  } catch (error) {
    return handleRouteError(error)
  }
}
