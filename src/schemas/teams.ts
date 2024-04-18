import { z } from '@hono/zod-openapi'
import { playerSchema } from './player'
import { IDType } from './schemas'

// Schema for the /teams/{id} endpoint
export const teamSchema = z.object({
  id: IDType,
  name: z.string(),
  tag: z.string(),
  logo: z.string(),
  country: z.string(),
  link: z.string(),
  socials: z.array(z.object({ name: z.string(), link: z.string() })),
  earnings: z.string(),
  players: z.array(playerSchema),
  staff: z.array(z.string()),
  staff_item: z.array(
    z.object({
      ign: z.string(),
      link: z.string(),
      id: IDType,
      role: z.string(),
    })
  ),
})
export type Team = z.infer<typeof teamSchema>
