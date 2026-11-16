import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../../lib/auth'
import { handleRouteError, jsonError, unauthorized } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    if (user.role !== 'ADMIN') return jsonError(403, 'FORBIDDEN', 'Admin access is required')

    const [users, universities, scholarships, reviews, favorites] = await prisma.$transaction([
      prisma.user.count(),
      prisma.university.count(),
      prisma.scholarship.count(),
      prisma.review.count(),
      prisma.favorite.count(),
    ])
    return NextResponse.json({ users, universities, scholarships, reviews, favorites })
  } catch (error) {
    return handleRouteError(error)
  }
}
