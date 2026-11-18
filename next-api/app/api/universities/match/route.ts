import { NextRequest } from 'next/server'
import { z } from 'zod'
import { handleRouteError, jsonData } from '../../../../lib/http'
import { matchUniversities } from '../../../../lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  field: z.string().trim().max(200).optional(),
  budgetYearly: z.number().finite().nonnegative().nullable().optional(),
  ieltsScore: z.number().finite().min(0).max(9).nullable().optional(),
  jlptLevel: z.string().trim().max(10).nullable().optional(),
  cityId: z.number().int().positive().nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json())
    const results = matchUniversities(input)
    return jsonData(results)
  } catch (error) {
    return handleRouteError(error)
  }
}
