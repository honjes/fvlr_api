import { z } from '@hono/zod-openapi'
import { typeEnum, regionsEnum, statusEnum } from './enums'
import { IDType } from './schemas'
import { matchSchema } from './match'
import { teamSchema } from './teams'
import { playerSchema } from './player'

// Schema for the /events endpoint
export const shortEventSchema = z
  .object({
    type: typeEnum.openapi({
      example: 'Event',
    }),
    id: IDType,
    link: z.string().openapi({
      example:
        'https://www.vlr.gg/event/1927/champions-tour-2023-china-ascension',
    }),
    name: z.string().openapi({
      example: 'Champions Tour 2023 China: Ascension',
    }),
    date: z.string().openapi({
      example: 'Dec 22—30',
    }),
    status: z
      .string()
      .regex(/New||Ongoing||Completed/)
      .openapi({
        example: 'completed',
      }),
    prize: z.string().openapi({
      example: '$250,000',
    }),
    region: regionsEnum.openapi({
      example: 'EU',
    }),
    logo: z.string().openapi({
      example: 'https://owcdn.net/img/6009f963577f4.png',
    }),
  })
  .array()

// Schema for the /event/{id} endpoint
export const eventSchema = z.object({
  type: typeEnum.openapi({
    example: 'Event',
  }),
  id: IDType,
  name: z.string().openapi({
    example: 'Champions Tour 2023 China: Ascension',
  }),
  link: z.string().openapi({
    example:
      'https://www.vlr.gg/event/1927/champions-tour-2023-china-ascension',
  }),
  logo: z.string().openapi({
    example: 'https://owcdn.net/img/6009f963577f4.png',
  }),
  status: statusEnum.openapi({
    example: statusEnum.enum.Completed,
  }),
  teams_item: z.array(
    z.object({
      name: z.string(),
      logo: z.string(),
      link: z.string(),
      id: IDType,
      players: z.array(
        z.object({
          type: typeEnum.openapi({
            example: 'Player',
          }),
          ign: z.string(),
          link: z.string(),
          id: IDType,
        })
      ),
      status: z.string(),
    })
  ),
  players_item: z.array(
    z.object({
      type: typeEnum.openapi({
        example: 'Event',
      }),
      ign: z.string(),
      name: z.string(),
      link: z.string(),
      id: IDType,
      team: z.object({
        type: typeEnum.openapi({
          example: 'Team',
        }),
        name: z.string(),
        id: IDType,
      }),
    })
  ),
  failed_links: z.array(z.string()),
})
export type Event = z.infer<typeof eventSchema>

// Schema for the /event/{id}/match endpoint
export const eventMatchesSchema = z.object({
  id: IDType,
  type: typeEnum.openapi({
    example: 'Event',
  }),
  name: z.string().openapi({
    example: 'Champions Tour 2023 China: Ascension',
  }),
  link: z.string().openapi({
    example:
      'https://www.vlr.gg/event/1927/champions-tour-2023-china-ascension',
  }),
  img: z.string().openapi({
    example: 'https://owcdn.net/img/6009f963577f4.png',
  }),
  matches: matchSchema.array(),
})
export type EventMatches = z.infer<typeof eventMatchesSchema>

// Schema for the /event/{id}/teams endpoint
export const eventTeamsSchema = eventSchema.extend({
  teams: z.array(teamSchema),
})
export type EventTeams = z.infer<typeof eventTeamsSchema>

// Schema for the /event/{id}/players endpoint
export const eventPlayersSchema = eventSchema.extend({
  players: z.array(playerSchema),
})
export type EventPlayers = z.infer<typeof eventPlayersSchema>

// Schema for the /event/{id}/full endpoint
export const fullEventSchema = eventSchema.extend({
  matches: z.array(matchSchema),
  teams: z.array(teamSchema),
  players: z.array(playerSchema),
})
export type EventFull = z.infer<typeof fullEventSchema>
