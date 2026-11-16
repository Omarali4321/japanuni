import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().trim().email().max(100).transform((value) => value.toLowerCase()),
  password: z.string().min(6).max(100),
})

export const registerSchema = authSchema.extend({
  fullName: z.string().trim().min(2).max(100),
})

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  bio: z.string().max(500).nullable().optional(),
  nationality: z.string().max(100).nullable().optional(),
  avatarUrl: z.string().url().max(200).nullable().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).nullable().optional(),
})
