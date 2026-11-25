import { NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/admin'
import { getUniversityById } from '../../../../lib/data'
import { handleRouteError } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (admin.error) return admin.error

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { user: { select: { fullName: true, email: true } } },
    })
    return NextResponse.json({
      data: reviews.map((r) => ({
        id: Number(r.id),
        rating: r.rating,
        comment: r.comment,
        userName: r.user.fullName,
        userEmail: r.user.email,
        universityId: Number(r.universityId),
        universityName: getUniversityById(Number(r.universityId))?.name ?? `#${r.universityId}`,
        createdAt: r.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
