// Object for agentstats

import { z } from '@hono/zod-openapi'

// TODO: change string to number when possible
export const agentStatsObject = z.object({
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

// Object for the stats of a player per site
export const extStatsObject = z
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
