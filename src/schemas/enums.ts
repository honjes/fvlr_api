import { z } from '@hono/zod-openapi'

export const regionsEnum = z.enum([
  'EU',
  'NA',
  'KR',
  'BR',
  'AP',
  'LATAM',
  'OCE',
])
export const typeEnum = z.enum(['Event', 'Match', 'Player', 'Team'])
export const statusEnum = z.enum(['Upcoming', 'Ongoing', 'Completed'])
export const timeEnum = z.enum(['t30', 't60', 't90', 'tall'])
