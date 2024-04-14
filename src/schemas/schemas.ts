import { z } from '@hono/zod-openapi'

// Enums
const regionsEnum = z.enum(['EU', 'NA', 'KR', 'BR', 'AP', 'LATAM', 'OCE'])
const typeEnum = z.enum(['Event', 'Match'])

// Types
const IDType = z
  .string()
  .min(1)
  .regex(/^[0-9]+$/) // Only numbers
  .openapi({
    example: '0 (1-16 characters)',
  })

const IDSchema = z.object({
  id: IDType,
})

const EventSchema = z
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

const TeamSchema = z.object({
  name: z.string().openapi({
    example: 'Team Liquid',
  }),
  id: z
    .string()
    .min(1)
    .regex(/^[0-9]+$/) // Only numbers
    .openapi({
      example: '000000000001927',
    }),
  mapScore: z.string().openapi({
    example: '13',
  }),
})
const GameSchema = z.object({
  map: z.string().openapi({
    example: 'Bind',
  }),
  teams: z.array(TeamSchema),
})
const StreamSchema = z.object({
  name: z.string(),
  link: z.string(),
})
const PlayerSchema = z.object({
  name: z.string(),
  link: z.string(),
})
// Schema for the /matches/{id} endpoint
const MatchSchema = z.object({
  type: typeEnum.openapi({
    example: 'Event',
  }),
  id: z
    .string()
    .min(1)
    .regex(/^[0-9]+$/) // Only numbers
    .openapi({
      example: '000000000001927',
    }),
  time: z.string(),
  event: z.string(), // ID or 0
  eventname: z.string(),
  streams: z.array(StreamSchema),
  players: z.array(PlayerSchema),
  games: z.array(GameSchema),
  teams: z.array(TeamSchema),
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
// Schema for the /matches endpoint
export const AllMatchSchema = z
  .object({
    date: z.string(),
    today: z.boolean(),
    matches: z.array(MatchSchema),
  })
  .array()

export { IDSchema, EventSchema, MatchSchema }
