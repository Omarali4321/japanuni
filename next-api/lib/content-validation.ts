import { z } from 'zod'

const page = z.coerce.number().int().min(0).max(10_000).default(0)
const size = z.coerce.number().int().min(1).max(50).default(12)

export const paginationSchema = z.object({ page, size })

export const scholarshipQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(200).optional(),
  universityId: z.coerce.number().int().positive().max(Number.MAX_SAFE_INTEGER).optional(),
})
