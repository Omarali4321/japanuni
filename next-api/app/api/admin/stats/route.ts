import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../../lib/auth'
import { handleRouteError, jsonError, unauthorized } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'
import { getUniversitiesIndex, getScholarships, getCities } from '../../../../lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    if (user.role !== 'ADMIN') return jsonError(403, 'FORBIDDEN', 'Admin access is required')

    const [users, reviews, favorites] = await prisma.$transaction([
      prisma.user.count(),
      prisma.review.count(),
      prisma.favorite.count(),
    ])
    const universities = getUniversitiesIndex()?.length ?? 0
    const scholarships = getScholarships()?.length ?? 0
    const cities = getCities()?.length ?? 0
    return NextResponse.json({ users, universities, scholarships, reviews, favorites, cities })
  } catch (error) {
    return handleRouteError(error)
  }
}
