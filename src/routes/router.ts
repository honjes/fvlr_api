// OPENAPI's FACE ya DINK
import { z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { Context } from 'hono'
// Scrappy Doo
import { fetchAllEvents } from '../scrapers/events/all'
import { fetchOneEvent } from '../scrapers/events/one'
import { fetchAllMatches } from '../scrapers/matches/all'
import { fetchOneMatch } from '../scrapers/matches/one'
// Schemas
import { EventSmallSchema, IDSchema } from '../schemas/schemas'

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
            schema: EventSmallSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Events = await fetchAllEvents()
    return c.json<Object>({
      status: 'success',
      data: Events,
    })
  },
}
const MatchRoute = {
  route: createRoute({
    method: 'get',
    path: '/match/{match_id}',
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
            schema: EventSmallSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Match = await fetchOneMatch(c.req.param('match_id'))
    return c.json<Object>({
      status: 'success',
      data: Match,
    })
  },
}
const PlayerRoute = {
  route: createRoute({
    method: 'get',
    path: '/player/{player_id}',
    tags: ['Root Routes'],
    request: {
      params: IDSchema,
    },
    responses: {
      200: {
        description: 'Fetches all events from the /events page',
        content: {
          'application/json': {
            schema: EventSmallSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Events = await fetchAllEvents()
    return c.json<Object>({
      status: 'success',
      data: Events,
    })
  },
}
const TeamRoute = {
  route: createRoute({
    method: 'get',
    path: '/team/{team_id}',
    tags: ['Root Routes'],
    request: {
      params: IDSchema,
    },
    responses: {
      200: {
        description: 'Fetches all events from the /events page',
        content: {
          'application/json': {
            schema: EventSmallSchema,
          },
        },
      },
    },
  }),
  handler: async (c: Context) => {
    const Events = await fetchAllEvents()
    return c.json<Object>({
      status: 'success',
      data: Events,
    })
  },
}
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
            schema: EventSmallSchema,
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
            schema: EventSmallSchema,
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
            schema: EventSmallSchema,
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
            schema: EventSmallSchema,
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

export const Routes = [
  EventsRoute,
  EventRoute,
  EventPlayersRoute,
  EventTeamsRoute,
  EventMatchesRoute,
  MatchRoute,
  PlayerRoute,
  TeamRoute,
]
