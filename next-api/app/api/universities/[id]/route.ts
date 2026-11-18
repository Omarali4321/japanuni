import { NextRequest } from 'next/server'
import { handleRouteError, jsonData, jsonError } from '../../../../lib/http'
import { findUniversityById } from '../../../../lib/data'
import { universityIdSchema } from '../../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = universityIdSchema.parse(context.params.id)
    const university = findUniversityById(id)
    if (!university) {
      return jsonError(404, 'UNIVERSITY_NOT_FOUND', 'University not found')
    }

    return jsonData(university)
  } catch (error) {
    return handleRouteError(error)
  }
}
