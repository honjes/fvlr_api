import { z } from '@hono/zod-openapi'
import { typeEnum, regionsEnum, statusEnum } from './enums'
import { IDType } from './schemas'
import { MatchSchema } from './match'

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
          type: typeEnum,
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
      type: typeEnum,
      ign: z.string(),
      name: z.string(),
      link: z.string(),
      id: IDType,
      team: z.object({
        type: typeEnum,
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
  id: IDType,
  img: z.string().openapi({
    example: 'https://owcdn.net/img/6009f963577f4.png',
  }),
  matches: MatchSchema.array(),
})
export type EventMatches = z.infer<typeof eventMatchesSchema>
