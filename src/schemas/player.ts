import { z } from '@hono/zod-openapi'
import { timeEnum } from './enums'
import { agentStatsObject } from './stats'
import { IDType } from './schemas'

// Object for the stats of a player
export const playerStatsObject = z
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

// Object for the player stats of top agents
export const playerAgentStatsObject = z.object({
  labels: z.array(z.string()),
  time: timeEnum,
  times: z.array(z.string()),
  data: z.array(agentStatsObject),
})
export type PlayerAgentStats = z.infer<typeof playerAgentStatsObject>

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
