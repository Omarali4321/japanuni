import { z } from 'zod'

const integerString = (name: string, max: number) =>
  z.coerce.number().int(`${name} must be an integer`).min(0).max(max)

export const universityListQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  cityId: integerString('cityId', Number.MAX_SAFE_INTEGER).optional(),
  maxTuition: z.coerce.number().finite().nonnegative().max(100_000_000_000).optional(),
  minRanking: integerString('minRanking', 1_000_000).optional(),
  institutionType: z.string().trim().max(100).optional(),
  mediumOfInstruction: z.string().trim().max(500).optional(),
  preArrivalAdmission: z.string().trim().max(100).optional(),
  intake: z.string().trim().max(200).optional(),
  page: integerString('page', 10_000).default(0),
  size: z.coerce.number().int().min(1).max(50).default(12),
})

export const universityIdSchema = z.coerce.number().int().positive().max(Number.MAX_SAFE_INTEGER)

export const compareSchema = z.object({
  universityIds: z.array(universityIdSchema).min(2).max(4),
}).superRefine((value, context) => {
  if (new Set(value.universityIds).size !== value.universityIds.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['universityIds'],
      message: 'universityIds must contain unique values',
    })
  }
})
