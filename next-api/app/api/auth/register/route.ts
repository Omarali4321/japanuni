import { NextRequest, NextResponse } from 'next/server'
import { handleRouteError, jsonError } from '../../../../lib/http'
import { createSession, hashPassword, setSessionCookie } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'
import { registerSchema } from '../../../../lib/user-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const input = registerSchema.parse(await request.json())
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing) return jsonError(400, 'EMAIL_ALREADY_REGISTERED', 'Email already registered')

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: await hashPassword(input.password),
        fullName: input.fullName,
        role: 'USER',
      },
    })
    const response = NextResponse.json({
      id: Number(user.id),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      type: 'Bearer',
    })
    setSessionCookie(response, await createSession(user.id, user.email, user.role))
    return response
  } catch (error) {
    return handleRouteError(error)
  }
}
