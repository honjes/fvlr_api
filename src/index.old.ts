// Vlr2 API with HONO and Redis
import { Context } from 'hono'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI, SwaggerUIOptions } from '@hono/swagger-ui'
import { createClient } from 'redis'
// Scrapers
import { fetchAllEvents } from './scrapers/events/all'
import { fetchOneEvent } from './scrapers/events/one'
import { fetchAllMatches } from './scrapers/matches/all'
import { fetchOneMatch } from './scrapers/matches/one'

// Types
import Response from './types/response'

// Initial Setup
const client = createClient()
const app = new OpenAPIHono()
// MiddleWare
// app.use("*", async (c, next) => {
//     // Check if the request is in the Redis Cache, if not then continue, if so then return the cached response
//     console.log(c.req.path);
//     if(c.req.path.includes("favicon.ico")) next();
//     else if( await client.exists(c.req.path) ) {
//         console.log("Cached Response");
//         const data = await client.get(c.req.path);
//         return c.json<Response>({
//             cached: true,
//             status: 'success',
//             data: JSON.parse(data)
//         })
//     } else {
//         console.log("Not Cached Response");
//         await next();
//         // Cache the response
//         const data = await c.res.json();
//         client.setEx(c.req.path, 60, JSON.stringify(data));
//         c.res = c.json<Response>({
//             cached: false,
//             status: 'success',
//             data: data
//         });
//     }
// })

// Routes
app.openapi(
  createRoute({
    method: 'get',
    path: '/hello',
    responses: {
      200: {
        description: 'Respond a message',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({
      message: 'hello',
    })
  }
)

app.get(
  '/ui',
  swaggerUI({
    url: '/doc',
  })
)
app.doc('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Vlr API',
    version: 'v0.1',
  },
})
app.get('/events', async (c: Context) => {
  const events = await fetchAllEvents()
  return c.json<Response>({
    status: 'success',
    data: events,
  })
})
app.get('/event/:id', async (c: Context) => {
  const events = await fetchOneEvent(c.req.param('id'))
  return c.json<Response>({
    status: 'success',
    data: events,
  })
})
app.get('/event/:id/players', async (c: Context) => {})
app.get('/event/:id/teams', async (c: Context) => {})
app.get('/event/:id/matches', async (c: Context) => {})
app.get('/event/:id/stats', async (c: Context) => {})
app.get('/matches/:eventid', async (c: Context) => {
  const matches = await fetchAllMatches(c.req.param('eventid'))
  return c.json<Response>({
    status: 'success',
    data: matches,
  })
})
app.get('/match/:id', async (c: Context) => {
  const match = await fetchOneMatch(c.req.param('id'))
  return c.json<Response>({
    status: 'success',
    data: match,
  })
})
app.notFound((c) => {
  return c.json<Response>({
    status: 'fail',
    error: 'Not Found',
  })
})
client.connect().then(() => {
  console.log('Redis connected!')
  client.flushAll().then(() => {
    console.log('Cleared Cache')
  })
})

export default app
