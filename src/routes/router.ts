// OPENAPI's FACE ya DINK
import { OpenAPIHono, z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { Context, Env } from 'hono'
import { validator } from 'hono/validator'

// Scrappy Doo
import { fetchAllEvents } from '../scrapers/events/all'
import { fetchOneEvent } from '../scrapers/events/one'
import { AllMatches, fetchAllMatches } from '../scrapers/matches/all'
import { Match, fetchOneMatch } from '../scrapers/matches/one'
import { fetchPlayer } from '../scrapers/player/one'
import { fetchOneTeam } from '../scrapers/team/one'
import { fetchEventMatches } from '../scrapers/events/matches'
import { generateScore } from '../scrapers/matches/score'

// Schemas / Types
import { IDSchema, ErrorSchema, errorSchema } from '../schemas/schemas'
import {
  Event,
  EventFull,
  EventPlayers,
  EventTeams,
  eventPlayersSchema,
  eventTeamsSchema,
} from '../schemas/events'
import { ShortEvent } from '../scrapers/events/all'
import {
  shortEventSchema,
  eventSchema,
  eventMatchesSchema,
  EventMatches,
} from '../schemas/events'
import { AllMatchSchema, matchSchema } from '../schemas/match'
import { playerSchema, Player } from '../schemas/player'
import { scoreSchema, Score } from '../schemas/score'
import { teamSchema, Team } from '../schemas/teams'
import { fetchEventTeams } from '../scrapers/events/teams'
import { fetchEventPlayers } from '../scrapers/events/players'
import { fetchEventFull } from '../scrapers/events/full'

// add All Routes related to Events
function addEventsRoute(app: OpenAPIHono<Env, {}, '/'>) {
  // GET /events
  app.openapi(
    createRoute({
      method: 'get',
      path: '/events',
      tags: ['Root Routes'],
      description: 'Fetches all events from the vlr.gg/events page',
      responses: {
        200: {
          description: 'Fetches all events from the /events page',
          content: {
            'application/json': {
              schema: shortEventSchema,
            },
          },
        },
      },
    }),
    async (c: Context) => {
      const Events = await fetchAllEvents()
      return c.json<ShortEvent>(Events)
    }
  )

  // GET /event/{id}
  app.openapi(
    {
      method: 'get',
      path: '/event/{id}',
      tags: ['Event Routes'],
      request: {
        params: IDSchema,
      },
      responses: {
        200: {
          description: 'Fetches a specific event',
          content: {
            'application/json': {
              schema: eventSchema,
            },
          },
        },
      },
    },
    async (c: Context) => {
      const id = c.req.param('id')
      // Validate input
      // make sure id is a string of numbers
      if (!id.match(/^[0-9]+$/)) throw new Error('Invalid ID')

      const Event = await fetchOneEvent(id).catch((err) => {
        throw Error(err)
      })
      return c.json<Event>(Event)
    }
  )

  // GET /event/{id}/players
  app.openapi(
    {
      method: 'get',
      path: '/event/{id}/players',
      tags: ['Event Routes'],
      request: {
        params: IDSchema,
      },
      responses: {
        200: {
          description: 'Fetches Players of a specific event',
          content: {
            'application/json': {
              schema: eventPlayersSchema,
            },
          },
        },
      },
    },
    async (c: Context) => {
      const EventPlayers = await fetchEventPlayers(c.req.param('id'))
      return c.json<EventPlayers>(EventPlayers)
    }
  )

  // GET /event/{id}/teams
  app.openapi(
    {
      method: 'get',
      path: '/event/{id}/teams',
      tags: ['Event Routes'],
      request: {
        params: IDSchema,
      },
      responses: {
        200: {
          description: 'Fetches Teams of a specific event',
          content: {
            'application/json': {
              schema: eventTeamsSchema,
            },
          },
        },
      },
    },
    async (c: Context) => {
      const eventTeams = await fetchEventTeams(c.req.param('id'))
      return c.json<EventTeams>(eventTeams)
    }
  )

  // GET /event/{id}/matches
  app.openapi(
    {
      method: 'get',
      path: '/event/{id}/matches',
      tags: ['Event Routes'],
      request: {
        params: IDSchema,
        query: z.object({
          ext: z.string().default('false'),
        }),
      },
      responses: {
        200: {
          description: 'Fetches matches of a specific event',
          content: {
            'application/json': {
              schema: eventMatchesSchema,
            },
          },
        },
      },
    },
    async (c: Context) => {
      const id = c.req.param('id')
      const ext = Boolean(c.req.query('ext') || false)

      // Validate input
      // make sure id is a string of numbers
      if (!id.match(/^[0-9]+$/)) throw new Error('Invalid ID')

      const Event = await fetchEventMatches(id, { ext })
      return c.json<EventMatches>(Event)
    }
  )

  // GET /event/{id}/full
  app.openapi(
    {
      method: 'get',
      path: '/event/{id}/full',
      tags: ['Event Routes'],
      request: {
        params: IDSchema,
      },
      responses: {
        200: {
          description: 'Fetches all data of a specific event',
          content: {
            'application/json': {
              schema: eventSchema,
            },
          },
        },
      },
    },
    async (c: Context) => {
      const id = c.req.param('id')

      // Validate input
      // make sure id is a string of numbers
      if (!id.match(/^[0-9]+$/)) throw new Error('Invalid ID')

      const eventFull = await fetchEventFull(id)
      return c.json<EventFull>(eventFull)
    }
  )
}

// add All Routes related to Matches
function addMatchRoutes(app: OpenAPIHono<Env, {}, '/'>) {
  // GET /matches
  app.openapi(
    createRoute({
      method: 'get',
      path: '/matches',
      tags: ['Root Routes'],
      description: 'Fetches all events from the vlr.gg/matches page',
      responses: {
        200: {
          description: 'Fetches all events from the /matches page',
          content: {
            'application/json': {
              schema: AllMatchSchema,
            },
          },
        },
      },
    }),
    async (c: Context) => {
      const Matches = await fetchAllMatches()
      return c.json<AllMatches>(Matches)
    }
  )

  // GET /match/{id}
  // Bad routes return successfully, but with empty params
  // This is because Matches and Form Threads are both using root ids
  // vlr.gg/{id}
  app.openapi(
    createRoute({
      method: 'get',
      path: '/match/{id}',
      tags: ['Root Routes'],
      request: {
        params: IDSchema,
        query: z.object({
          ext: z.string().default('false'),
          includePlayers: z.string().default('true'),
        }),
      },
      description: 'Fetches a Match based on the Match ID from vlr.gg',
      responses: {
        200: {
          description: 'Fetches a Match based on the Match ID from vlr.gg',
          content: {
            'application/json': {
              schema: matchSchema,
            },
          },
        },
      },
    }),
    async (c: Context) => {
      const ext = Boolean(c.req.query('ext') || false)
      const includePlayers = Boolean(c.req.query('includePlayers') || true)
      // validate Match ID
      // make sure id is a string of numbers
      if (!c.req.param('id').match(/^[0-9]+$/)) throw new Error('Invalid ID')
      const Match = await fetchOneMatch(c.req.param('id'), {
        ext,
        includePlayers,
      })
      return c.json<Match>(Match)
    }
  )
}

// add All Player Routes
function addPlayerRoutes(app: OpenAPIHono<Env, {}, '/'>) {
  // GET /player/{id}
  app.openapi(
    createRoute({
      method: 'get',
      path: '/player/{id}',
      tags: ['Root Routes'],
      request: {
        params: IDSchema,
      },
      description: 'Fetches a Player based on their ID from vlr.gg',
      responses: {
        200: {
          description: 'Fetches a Player based on their ID from vlr.gg',
          content: {
            'application/json': {
              schema: playerSchema,
            },
          },
        },
      },
    }),
    async (c: Context) => {
      const Player = await fetchPlayer(c.req.param('id'))
      return c.json<Player>(Player)
    }
  )
}

// add All Team Routes
function addTeamRoutes(app: OpenAPIHono<Env, {}, '/'>) {
  // GET /team/{id}
  app.openapi(
    createRoute({
      method: 'get',
      path: '/team/{id}',
      tags: ['Root Routes'],
      request: {
        params: IDSchema,
        query: z.object({
          ext: z.string().default('false'),
          includePlayers: z.string().default('true'),
        }),
      },
      description: 'Fetches a Team based on their ID from vlr.gg',
      responses: {
        200: {
          description: 'Fetches a Team based on their ID from vlr.gg',
          content: {
            'application/json': {
              schema: teamSchema,
            },
          },
        },
      },
    }),
    async (c: Context) => {
      const id = c.req.param('id')
      const ext = Boolean(c.req.query('ext') || false)
      const includePlayers = Boolean(c.req.query('includePlayers') || true)
      // Validate input
      // make sure id is a string of numbers
      if (!id.match(/^[0-9,]+$/)) throw new Error('Invalid ID')

      const Team = await fetchOneTeam(id, { ext, includePlayers })
      return c.json<Team>(Team)
    }
  )
}

// add All Score Routes
function addScoreRoutes(app: OpenAPIHono<Env, {}, '/'>) {
  // GET /score/{id}
  app.openapi(
    createRoute({
      method: 'get',
      path: '/score/{id}',
      tags: ['Root Routes'],
      request: {
        params: IDSchema,
      },
      responses: {
        200: {
          description: 'Generates the score for a given match',
          content: {
            'application/json': {
              schema: scoreSchema,
            },
          },
        },
      },
    }),
    async (c: Context) => {
      const Score = await generateScore(c.req.param('id'))
      return c.json<Score>(Score)
    }
  )
}

// add Error Route
function addErrorRoutes(app: OpenAPIHono<Env, {}, '/'>) {
  //- Add event specific routes
  // GET /error/{type}
  app.openapi(
    createRoute({
      method: 'get',
      path: '/error/{type}?',
      tags: ['Event Routes'],
      request: {
        params: z.object({
          type: z.string().optional(),
        }),
      },
      responses: {
        200: {
          description: 'Displays a generic error for each type',
          content: {
            'application/json': {
              schema: errorSchema,
            },
          },
        },
      },
    }),
    async (c: Context) => {
      const type = c.req.param('type')
      return c.json<ErrorSchema>({
        status: 'error',
        message: 'Error: 404',
      })
    }
  )
}

export default function addRoutes(app: OpenAPIHono<Env, {}, '/'>) {
  addEventsRoute(app)
  addMatchRoutes(app)
  addPlayerRoutes(app)
  addTeamRoutes(app)
  addScoreRoutes(app)
  addErrorRoutes(app)
}

/*export const Routes = [
  EventsRoute,
  EventRoute,
  EventPlayersRoute,
  EventTeamsRoute,
  EventMatchesRoute,
  MatchesRoute,
  MatchRoute,
  PlayerRoute,
  TeamRoute,
  ErrorRoute,
  ScoreRoute,
]*/
