import { z } from 'zod'

export const mealsBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  time: z.string(),
  isDiet: z.boolean(),
})

export const idSchema = z.object({
  id: z.string().uuid(),
})
