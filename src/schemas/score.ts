import { z } from '@hono/zod-openapi'
import { matchSchema } from './match'
import { IDType } from './schemas'

// Schema for the /score/{id} endpoint
export const scoreSchema = z.object({
  id: IDType,
  scores_array: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
    })
  ),
  scores_object: z.record(z.string(), z.number()),
  match: matchSchema,
})
export type Score = z.infer<typeof scoreSchema>
