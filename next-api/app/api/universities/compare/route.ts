import { NextRequest } from 'next/server'
import { handleRouteError, jsonData, jsonError } from '../../../../lib/http'
import { findUniversitiesByIds } from '../../../../lib/data'
import { compareSchema } from '../../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = compareSchema.parse(await request.json())
    const ids = body.universityIds
    const universities = findUniversitiesByIds(ids)
    const foundIds = new Set(universities.map((u: { id: number }) => u.id))
    const missingIds = ids.filter((id) => !foundIds.has(id))

    if (missingIds.length) {
      return jsonError(404, 'UNIVERSITIES_NOT_FOUND', 'One or more universities were not found', {
        missingIds,
      })
    }

    const byId = new Map(universities.map((u: { id: number }) => [u.id, u]))
    return jsonData(ids.map((id) => byId.get(id)!))
  } catch (error) {
    return handleRouteError(error)
  }
}
