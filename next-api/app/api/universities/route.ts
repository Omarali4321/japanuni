import { NextRequest } from 'next/server'
import { handleRouteError, jsonList, jsonError } from '../../../lib/http'
import { findUniversities } from '../../../lib/data'
import { universityListQuerySchema } from '../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Server-side timeout (8s) - leaves 2s margin before Vercel's 10s limit
const SERVER_TIMEOUT_MS = 8000

export async function GET(request: NextRequest) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), SERVER_TIMEOUT_MS)

  try {
    const raw = Object.fromEntries(request.nextUrl.searchParams.entries())
    const query = universityListQuerySchema.parse(raw)

    // Check for abort before processing
    if (controller.signal.aborted) {
      throw new Error('TIMEOUT')
    }

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
    if (error instanceof Error && error.message === 'TIMEOUT') {
      return jsonError(504, 'TIMEOUT', 'Filter request timed out. Please try again.')
    }
    return handleRouteError(error)
  } finally {
    clearTimeout(timeoutId)
  }
}
