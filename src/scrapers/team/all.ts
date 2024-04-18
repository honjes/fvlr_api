// Fetches all teams based on provided team ids

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { z } from '@hono/zod-openapi'
import { teamSchema } from '../../schemas/teams'

// Type
type Player = z.infer<typeof teamSchema>
