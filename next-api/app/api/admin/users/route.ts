import { NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/admin'
import { handleRouteError } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (admin.error) return admin.error

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true, email: true, fullName: true, role: true, createdAt: true,
        _count: { select: { reviews: true, favorites: true } },
      },
    })
    return NextResponse.json({
      data: users.map((u) => ({
        id: Number(u.id),
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
        reviews: u._count.reviews,
        favorites: u._count.favorites,
      })),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
