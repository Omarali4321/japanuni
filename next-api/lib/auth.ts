import { compare, hash } from 'bcryptjs'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

export const SESSION_COOKIE = 'japanuni_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24

function secretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters')
  }
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string) {
  return hash(password, 12)
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash)
}

export async function createSession(userId: bigint, email: string, role: string) {
  return new SignJWT({ role, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId.toString())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey())
}

export async function getSessionUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secretKey())
    const userId = typeof payload.sub === 'string' ? BigInt(payload.sub) : null
    if (!userId) return null

    return prisma.user.findUnique({
      where: { id: userId },
    })
  } catch {
    return null
  }
}

export function setSessionCookie(response: Response, token: string) {
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  )
}

export function clearSessionCookie(response: Response) {
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  )
}

export function userDto(user: {
  id: bigint
  email: string
  fullName: string
  bio: string | null
  nationality: string | null
  avatarUrl: string | null
  role: string
}) {
  return {
    id: Number(user.id),
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
    nationality: user.nationality,
    avatarUrl: user.avatarUrl,
    role: user.role,
  }
}
