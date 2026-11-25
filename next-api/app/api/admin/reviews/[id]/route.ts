import { NextRequest, NextResponse } from 'next/server'
import { adminId, requireAdmin } from '../../../../../lib/admin'
import { handleRouteError, jsonError } from '../../../../../lib/http'
import { prisma } from '../../../../../lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return admin.error
    const id = adminId(context.params.id)
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return jsonError(404, 'REVIEW_NOT_FOUND', 'Review not found')
    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ message: 'Review deleted' })
  } catch (error) {
    return handleRouteError(error)
  }
}
