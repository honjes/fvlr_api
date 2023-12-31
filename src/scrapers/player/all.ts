// Fetches all players based on ID provided

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { z } from '@hono/zod-openapi'
import { PlayerSchema } from '../../schemas/schemas'
// Type
type Player = z.infer<typeof PlayerSchema>
