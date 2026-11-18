import { NextRequest } from 'next/server'
import { handleRouteError, jsonData, jsonError } from '../../../../lib/http'
import { getScholarships } from '../../../../lib/data'
import { universityIdSchema } from '../../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function scholarshipDto(scholarship: {
  id: number
  title: string
  description: string | null
  amountYearly: string | null
  coverage: string | null
  deadlineMonth: string | null
  eligibility: string | null
  universityId: number | null
}) {
  return {
    id: scholarship.id,
    title: scholarship.title,
    description: scholarship.description,
    amountYearly: scholarship.amountYearly,
    coverage: scholarship.coverage,
    deadlineMonth: scholarship.deadlineMonth,
    eligibility: scholarship.eligibility,
    universityId: scholarship.universityId,
    universityName: null, // University name not in JSON, would need separate lookup
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(universityIdSchema.parse(context.params.id))
    const scholarships = getScholarships() ?? []
    const scholarship = scholarships.find((s) => s.id === id)
    if (!scholarship) return jsonError(404, 'SCHOLARSHIP_NOT_FOUND', 'Scholarship not found')
    return jsonData(scholarshipDto(scholarship))
  } catch (error) {
    return handleRouteError(error)
  }
}
