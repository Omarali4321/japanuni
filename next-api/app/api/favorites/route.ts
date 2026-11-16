import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../lib/auth'
import { handleRouteError, unauthorized } from '../../../lib/http'
import { prisma } from '../../../lib/prisma'
import { toUniversityDto, universityInclude } from '../../../lib/universities'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { university: { include: universityInclude } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(favorites.map((favorite) => ({
      ...toUniversityDto(favorite.university),
      favorited: true,
    })))
  } catch (error) {
    return handleRouteError(error)
  }
}
