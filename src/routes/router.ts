// OPENAPI's FACE ya DINK
import { z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { Context } from 'hono'

// Scrappy Doo
import { fetchAllEvents } from '../scrapers/events/all'
import { fetchOneEvent } from '../scrapers/events/one'
import { fetchOneMatch } from '../scrapers/matches/one'
import { fetchOnePlayer } from '../scrapers/player/one'
import { fetchOneTeam } from '../scrapers/team/one'

// Schemas
import { EventSchema, IDSchema } from '../schemas/schemas'

// Works Perfectly
const EventsRoute = {
  route: createRoute({
    method: 'get',
    path: '/events',
    tags: ['Root Routes'],
    description: 'Fetches all events from the vlr.gg/events page',
    responses: {
      200: {
        description: 'Fetches all events from the /events page',
        content: {
          'application/json': {
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Events = await fetchAllEvents()
    return c.json<Object>(Events)
  },
}

// Bad routes return successfully, but with empty params
// This is because Matches and Form Threads are both using root ids
// vlr.gg/{id}
//- Needs Schema Work
const MatchRoute = {
  route: createRoute({
    method: 'get',
    path: '/match/{id}',
    tags: ['Root Routes'],
    request: {
      params: IDSchema,
    },
    description: 'Fetches a Match based on the Match ID from vlr.gg',
    responses: {
      200: {
        description: 'Fetches a Match based on the Match ID from vlr.gg',
        content: {
          'application/json': {
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Match = await fetchOneMatch(c.req.param('id'))
    return c.json<Object>(Match)
  },
}

// Works Perfectly!
//- Needs Schema Work
const PlayerRoute = {
  route: createRoute({
    method: 'get',
    path: '/player/{id}',
    tags: ['Root Routes'],
    request: {
      params: IDSchema,
    },
    responses: {
      200: {
        description: 'Fetches a Player based on their ID from vlr.gg',
        content: {
          'application/json': {
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Player = await fetchOnePlayer(c.req.param('id')).catch((err) => {
      throw Error(err)
    })
    return c.json<Object>(Player)
  },
}

// Works Perfectly!
//- Needs Schema Work
const TeamRoute = {
  route: createRoute({
    method: 'get',
    path: '/team/{id}',
    tags: ['Root Routes'],
    request: {
      params: IDSchema,
    },
    responses: {
      200: {
        description: 'Fetches all events from the /events page',
        content: {
          'application/json': {
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Team = await fetchOneTeam(c.req.param('id')).catch((err) => {
      throw Error(err)
    })
    return c.json<Object>(Team)
  },
}

// Works Perfectly!
//- Needs Schema Work
const EventRoute = {
  route: createRoute({
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
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Event = await fetchOneEvent(c.req.param('id')).catch((err) => {
      throw Error(err)
    })
    return c.json<Object>(Event)
  },
}
// Untested
//- Needs Schema Work
const EventPlayersRoute = {
  route: createRoute({
    method: 'get',
    path: '/event/{id}/players',
    tags: ['Event Routes'],
    request: {
      params: IDSchema,
    },
    responses: {
      200: {
        description: 'Fetches a specific event',
        content: {
          'application/json': {
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Event = await fetchOneEvent(c.req.param('id'))
    return c.json<Object>({
      status: 'success',
      data: Event,
    })
  },
}
// Untested
//- Needs Schema Work
const EventTeamsRoute = {
  route: createRoute({
    method: 'get',
    path: '/event/{id}/teams',
    tags: ['Event Routes'],
    request: {
      params: IDSchema,
    },
    responses: {
      200: {
        description: 'Fetches a specific event',
        content: {
          'application/json': {
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Event = await fetchOneEvent(c.req.param('id'))
    return c.json<Object>({
      status: 'success',
      data: Event,
    })
  },
}
// Untested
//- Needs Schema Work
const EventMatchesRoute = {
  route: createRoute({
    method: 'get',
    path: '/event/{id}/matches',
    tags: ['Event Routes'],
    request: {
      params: IDSchema,
    },
    responses: {
      200: {
        description: 'Fetches a specific event',
        content: {
          'application/json': {
            schema: EventSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Event = await fetchOneEvent(c.req.param('id'))
    return c.json<Object>({
      status: 'success',
      data: Event,
    })
  },
}

// Working!
//- Add event specific routes
const ErrorRoute = {
  route: createRoute({
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
            schema: z.object({
              status: z.string().openapi({ example: 'error' }),
              message: z.string().openapi({ example: 'Error: 404' }),
            }),
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const type = c.req.param('type')
    return c.json<Object>({
      status: 'error',
      message: 'Error: 404',
    })
  },
}

export const Routes = [
  EventsRoute,
  EventRoute,
  EventPlayersRoute,
  EventTeamsRoute,
  EventMatchesRoute,
  MatchRoute,
  PlayerRoute,
  TeamRoute,
  ErrorRoute,
]
