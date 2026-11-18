import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../lib/auth'
import { handleRouteError, unauthorized } from '../../../lib/http'
import { prisma } from '../../../lib/prisma'
import { findUniversitiesByIds } from '../../../lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    const universityIds = favorites.map((f) => Number(f.universityId))
    const universities = findUniversitiesByIds(universityIds)
    return NextResponse.json(universities.map((university) => ({
      ...university,
      favorited: true,
    })))
  } catch (error) {
    return handleRouteError(error)
  }
}
