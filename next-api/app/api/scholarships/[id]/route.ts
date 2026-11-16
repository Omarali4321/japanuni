import { NextRequest } from 'next/server'
import { handleRouteError, jsonData, jsonError } from '../../../../lib/http'
import { scholarshipDto, scholarshipInclude } from '../../../../lib/content'
import { prisma } from '../../../../lib/prisma'
import { universityIdSchema } from '../../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = BigInt(universityIdSchema.parse(context.params.id))
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: scholarshipInclude,
    })
    if (!scholarship) return jsonError(404, 'SCHOLARSHIP_NOT_FOUND', 'Scholarship not found')
    return jsonData(scholarshipDto(scholarship))
  } catch (error) {
    return handleRouteError(error)
  }
}
