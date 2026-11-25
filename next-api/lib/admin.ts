import { z } from 'zod'
import { getSessionUser } from './auth'
import { jsonError, unauthorized } from './http'
import { universityIdSchema } from './university-validation'

export const roleSchema = z.object({ role: z.enum(['USER', 'ADMIN']) })

export function adminId(value: string) {
  return BigInt(universityIdSchema.parse(value))
}

/** Returns the admin user, or an error response to return immediately. */
export async function requireAdmin() {
  const user = await getSessionUser()
  if (!user) return { error: unauthorized() }
  if (user.role !== 'ADMIN') return { error: jsonError(403, 'FORBIDDEN', 'Admin access is required') }
  return { user }
}
