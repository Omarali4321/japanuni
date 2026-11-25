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
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
    return NextResponse.json({
      data: rows.map((m) => ({
        id: Number(m.id), name: m.name, email: m.email, subject: m.subject,
        message: m.message, createdAt: m.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
