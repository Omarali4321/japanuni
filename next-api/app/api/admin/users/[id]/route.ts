import { NextRequest, NextResponse } from 'next/server'
import { adminId, requireAdmin, roleSchema } from '../../../../../lib/admin'
import { handleRouteError, jsonError } from '../../../../../lib/http'
import { prisma } from '../../../../../lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return admin.error
    const id = adminId(context.params.id)
    const { role } = roleSchema.parse(await request.json())
    if (id === admin.user.id) return jsonError(400, 'SELF_ACTION', 'You cannot change your own role')

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return jsonError(404, 'USER_NOT_FOUND', 'User not found')
    await prisma.user.update({ where: { id }, data: { role } })
    return NextResponse.json({ id: Number(id), role })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    if (admin.error) return admin.error
    const id = adminId(context.params.id)
    if (id === admin.user.id) return jsonError(400, 'SELF_ACTION', 'You cannot delete your own account')

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return jsonError(404, 'USER_NOT_FOUND', 'User not found')
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { userId: id } }),
      prisma.favorite.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ])
    return NextResponse.json({ message: 'User deleted' })
  } catch (error) {
    return handleRouteError(error)
  }
}
