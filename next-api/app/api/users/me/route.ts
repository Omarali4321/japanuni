import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, userDto } from '../../../../lib/auth'
import { handleRouteError, unauthorized } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'
import { profileSchema } from '../../../../lib/user-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getSessionUser()
  return user ? NextResponse.json(userDto(user)) : unauthorized()
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const input = profileSchema.parse(await request.json())
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: input,
    })
    return NextResponse.json(userDto(updated))
  } catch (error) {
    return handleRouteError(error)
  }
}
