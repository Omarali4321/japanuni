import { NextRequest } from 'next/server'
import { handleRouteError, jsonData, jsonError } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'
import { toUniversityDto, universityInclude } from '../../../../lib/universities'
import { compareSchema } from '../../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = compareSchema.parse(await request.json())
    const ids = body.universityIds.map(BigInt)
    const universities = await prisma.university.findMany({
      where: { id: { in: ids } },
      include: universityInclude,
    })
    const foundIds = new Set(universities.map((university) => university.id.toString()))
    const missingIds = ids
      .filter((id) => !foundIds.has(id.toString()))
      .map(Number)

    if (missingIds.length) {
      return jsonError(404, 'UNIVERSITIES_NOT_FOUND', 'One or more universities were not found', {
        missingIds,
      })
    }

    const byId = new Map(universities.map((university) => [university.id.toString(), university]))
    return jsonData(ids.map((id) => toUniversityDto(byId.get(id.toString())!)))
  } catch (error) {
    return handleRouteError(error)
  }
}
