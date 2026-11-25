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
    const found = await prisma.contactMessage.findUnique({ where: { id } })
    if (!found) return jsonError(404, 'MESSAGE_NOT_FOUND', 'Message not found')
    await prisma.contactMessage.delete({ where: { id } })
    return NextResponse.json({ message: 'Message deleted' })
  } catch (error) {
    return handleRouteError(error)
  }
}
