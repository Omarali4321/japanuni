import { NextResponse } from 'next/server'
import { getSessionUser } from '../../../../lib/auth'
import { handleRouteError, jsonError, unauthorized } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'
import { universityIdSchema } from '../../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  _request: Request,
  context: { params: { universityId: string } },
) {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const universityId = BigInt(universityIdSchema.parse(context.params.universityId))
    const university = await prisma.university.findUnique({ where: { id: universityId } })
    if (!university) return jsonError(404, 'UNIVERSITY_NOT_FOUND', 'University not found')
    const exists = await prisma.favorite.findUnique({
      where: { userId_universityId: { userId: user.id, universityId } },
    })
    if (exists) return jsonError(400, 'ALREADY_FAVORITED', 'Already in favorites')
    await prisma.favorite.create({ data: { userId: user.id, universityId } })
    return NextResponse.json({ message: 'Added to favorites' })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: Request,
  context: { params: { universityId: string } },
) {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const universityId = BigInt(universityIdSchema.parse(context.params.universityId))
    await prisma.favorite.deleteMany({ where: { userId: user.id, universityId } })
    return NextResponse.json({ message: 'Removed from favorites' })
  } catch (error) {
    return handleRouteError(error)
  }
}
