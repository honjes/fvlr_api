import { z } from '@hono/zod-openapi'
import { statusEnum, typeEnum } from './enums'
import { playerStatsObject } from './player'
import { extStatsObject } from './stats'
import { IDType } from './schemas'
import { teamSchema } from './teams'

// Object for the team used in matches
const gameTeamObject = z.object({
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
export type GameTeam = z.infer<typeof gameTeamObject>

// Object for the team used in Game
const gameTeamExtendedObject = gameTeamObject.extend({
  players: z.array(z.string()),
  scoreAdvanced: z.object({
    t: z.number(),
    ct: z.number(),
    ot: z.number(),
  }),
})
export type GameTeamExtended = z.infer<typeof gameTeamExtendedObject>

// Object for the game used in matches
const gameObject = z.object({
  map: z.string().openapi({
    example: 'Bind',
  }),
  teams: z.array(gameTeamExtendedObject),
})
export type Game = z.infer<typeof gameObject>

// Object for the stream used in matches
const streamObject = z.object({
  name: z.string(),
  link: z.string(),
})
export type Stream = z.infer<typeof streamObject>

// Object for the stats of a player
export const playerMatchStatsObject = z.object({
  name: z.string(),
  team: z.string(),
  link: z.string(),
  stats: playerStatsObject,
  statsAdvanced: extStatsObject,
})
export const playerMatchStatsArraySchema = playerMatchStatsObject.array()
export type PlayerMatchStats = z.infer<typeof playerMatchStatsArraySchema>
export type PlayerMatchStatsElement = z.infer<
  typeof playerMatchStatsArraySchema.element
>

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
  teams: z.array(gameTeamObject).or(z.array(teamSchema)),
  players: playerMatchStatsArraySchema.or(z.undefined()),
})
export type Match = z.infer<typeof MatchSchema>

// Schema for the /matches endpoint
export const AllMatchSchema = z
  .object({
    date: z.string(),
    today: z.boolean(),
    matches: z.array(MatchSchema),
  })
  .array()
