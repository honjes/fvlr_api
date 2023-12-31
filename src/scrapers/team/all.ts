// Fetches all teams based on provided team ids

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { z } from '@hono/zod-openapi'
import { TeamSchema } from '../../schemas/schemas'
// Type
type Player = z.infer<typeof TeamSchema>
