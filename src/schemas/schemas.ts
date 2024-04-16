import { z } from '@hono/zod-openapi'

// Enums
export const regionsEnum = z.enum([
  'EU',
  'NA',
  'KR',
  'BR',
  'AP',
  'LATAM',
  'OCE',
])
export const typeEnum = z.enum(['Event', 'Match'])
export const statusEnum = z.enum(['Upcoming', 'Ongoing', 'Completed'])
export const timeEnum = z.enum(['t30', 't60', 't90', 'tall'])

// Util Objects
// TODO: add openapi examples
// Object for the stats of a player
const playerStatsObject = z
  .object({
    kdr: z.string(),
    acs: z.string(),
    k: z.string(),
    d: z.string(),
    a: z.string(),
    kdb: z.string(),
    kast: z.string(),
    adr: z.string(),
    hs: z.string(),
    fk: z.string(),
    fd: z.string(),
    fkdb: z.string(),
  })
  .openapi({
    example: {
      kdr: '1.20',
      acs: '230',
      k: '29',
      d: '21',
      a: '6',
      kdb: '+8',
      kast: '69%',
      adr: '162',
      hs: '37%',
      fk: '2',
      fd: '2',
      fkdb: '0',
    },
  })
export type PlayerStats = z.infer<typeof playerStatsObject>

// Object for the stats of a player per site
const extStatsObject = z
  .object({
    kdr: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    acs: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    k: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    d: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    a: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    kdb: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    kast: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    adr: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    hs: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    fk: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    fd: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
    fkdb: z.object({
      ct: z.string(),
      t: z.string(),
      ot: z.string(),
    }),
  })
  .openapi({
    example: {
      kdr: {
        ct: '0.88',
        t: '1.51',
        ot: '',
      },
      acs: {
        ct: '127',
        t: '334',
        ot: '',
      },
      k: {
        ct: '7',
        t: '22',
        ot: '',
      },
      d: {
        ct: '11',
        t: '10',
        ot: '',
      },
      a: {
        ct: '2',
        t: '4',
        ot: '',
      },
      kdb: {
        ct: '-4',
        t: '+12',
        ot: '',
      },
      kast: {
        ct: '56%',
        t: '83%',
        ot: '',
      },
      adr: {
        ct: '108',
        t: '216',
        ot: '',
      },
      hs: {
        ct: '40%',
        t: '35%',
        ot: '',
      },
      fk: {
        ct: '0',
        t: '2',
        ot: '',
      },
      fd: {
        ct: '1',
        t: '1',
        ot: '',
      },
      fkdb: {
        ct: '-1',
        t: '+1',
        ot: '',
      },
    },
  })
export type ExtStats = z.infer<typeof extStatsObject>

// Object for agentstats
// TODO: change string to number when possible
const agentStatsObject = z.object({
  Agent: z.string(),
  Use: z.string(),
  RND: z.string(),
  Rating: z.string(),
  ACS: z.string(),
  'K:D': z.string(),
  ADR: z.string(),
  KAST: z.string(),
  KPR: z.string(),
  APR: z.string(),
  FKPR: z.string(),
  FDPR: z.string(),
  K: z.string(),
  D: z.string(),
  A: z.string(),
  FK: z.string(),
  FD: z.string(),
})
export type AgentStats = z.infer<typeof agentStatsObject>

// Object for the player stats of top agents
export const playerAgentStatsObject = z.object({
  labels: z.array(z.string()),
  time: timeEnum,
  times: z.array(z.string()),
  data: z.array(agentStatsObject),
})
export type PlayerAgentStats = z.infer<typeof playerAgentStatsObject>

// Object for the team used in matches
const teamObject = z.object({
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
  score: z.string().openapi({
    example: '13',
  }),
})
export type Team = z.infer<typeof teamObject>

// Object for the team used in Game
const teamObjectExtended = teamObject.extend({
  players: z.array(z.string()),
  scoreAdvanced: z.object({
    t: z.number(),
    ct: z.number(),
    ot: z.number(),
  }),
})
export type TeamExtended = z.infer<typeof teamObjectExtended>

// Object for the game used in matches
const gameObject = z.object({
  map: z.string().openapi({
    example: 'Bind',
  }),
  teams: z.array(teamObjectExtended),
})
export type Game = z.infer<typeof gameObject>

// Object for the stream used in matches
const streamObject = z.object({
  name: z.string(),
  link: z.string(),
})
export type Stream = z.infer<typeof streamObject>

// Object for the player stats in a match
export const playerMatchStatsObject = z
  .object({
    name: z.string(),
    team: z.string(),
    link: z.string(),
    stats: playerStatsObject,
    statsAdvanced: extStatsObject,
  })
  .array()

export type PlayerMatchStats = z.infer<typeof playerMatchStatsObject>
export type PlayerMatchStatsElement = z.infer<
  typeof playerMatchStatsObject.element
>

// Schemas
// TODO: move all typeExports heare
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

// Schema for the /events endpoint
export const EventSchema = z
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

// Schema for the /players/{id} endpoint
export const playerSchema = z.object({
  ign: z.string(),
  name: z.string(),
  realName: z.string(),
  id: IDType,
  link: z.string(),
  photo: z.string(),
  country: z.string(),
  team: IDType.optional(),
  role: z.string(),
  earnings: z.string(),
  stats: playerAgentStatsObject,
  agentStats: z.object({
    // TODO: find a way to automate this with the agentArray
    astra: agentStatsObject,
    breach: agentStatsObject,
    brimstone: agentStatsObject,
    chamber: agentStatsObject,
    clove: agentStatsObject,
    cypher: agentStatsObject,
    deadlock: agentStatsObject,
    fade: agentStatsObject,
    gekko: agentStatsObject,
    harbor: agentStatsObject,
    iso: agentStatsObject,
    jett: agentStatsObject,
    kayo: agentStatsObject,
    killjoy: agentStatsObject,
    neon: agentStatsObject,
    omen: agentStatsObject,
    phoenix: agentStatsObject,
    raze: agentStatsObject,
    reyna: agentStatsObject,
    sage: agentStatsObject,
    skye: agentStatsObject,
    sova: agentStatsObject,
    viper: agentStatsObject,
    yoru: agentStatsObject,
  }),
})
export type Player = z.infer<typeof playerSchema>

// Schema for the /matches/{id} endpoint
export const MatchSchema = z.object({
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
  link: z.string().openapi({
    example:
      'https://www.vlr.gg/314629/sentinels-vs-leviat-n-champions-tour-2024-americas-stage-1-w2/?game=163369&tab=overview',
  }),
  date: z.string().openapi({
    example: 'Dec 22—30',
  }),
  time: z.string().openapi({
    example: '1:25 AM CEST',
  }),
  eventId: IDType, // ID or 0
  eventName: z.string(),
  logo: z.string().openapi({
    example: 'https://owcdn.net/img/6009f963577f4.png',
  }),
  streams: z.array(streamObject),
  status: statusEnum.openapi({
    example: statusEnum.enum.Completed,
  }),
  games: z.array(gameObject),
  teams: z.array(teamObject),
  players: playerMatchStatsArraySchema,
})
// Schema for the /matches endpoint
export const AllMatchSchema = z
  .object({
    date: z.string(),
    today: z.boolean(),
    matches: z.array(MatchSchema),
  })
  .array()

export { IDSchema }
