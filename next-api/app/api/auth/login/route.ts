import { NextRequest, NextResponse } from 'next/server'
import { createSession, setSessionCookie, verifyPassword } from '../../../../lib/auth'
import { handleRouteError, jsonError } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'
import { authSchema } from '../../../../lib/user-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const input = authSchema.parse(await request.json())
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user || !(await verifyPassword(input.password, user.password))) {
      return jsonError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
    }

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
