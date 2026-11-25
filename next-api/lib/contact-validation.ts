import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(100),
  subject: z.enum(['general', 'partnership', 'press', 'technical', 'feedback', 'other']),
  message: z.string().trim().min(1).max(5000),
})
