// Vlr2 API with HONO and Redis
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { Routes } from './routes/router'
import { createClient } from 'redis'

// Initial Setup
const app = new OpenAPIHono()
const client = createClient()
// Caching
const cachePaths = ['/events', '/event', '/matches', '/match']
app.use('*', async (c, next) => {
  if (!cachePaths.some((path) => c.req.path.includes(path))) {
    await next()
    return
  }
  // Check if the request is in the Redis Cache, if not then continue, if so then return the cached response
  if (await client.exists(c.req.path)) {
    console.log('Cached Response')
    const data = await client.get(c.req.path)
    let ret
    try {
      ret = JSON.parse(data)
    } catch {
      // Clear Cache
      client.del(c.req.path)
      await next()
      return
    }
    return c.json({
      cached: true,
      status: 'success',
      data: ret,
    })
  } else {
    console.log('Not Cached Response')
    await next()
    // Cache the response
    const data = await c.res.json()
    client.setEx(c.req.path, 60, JSON.stringify(data))
    c.res = c.json({
      cached: false,
      status: 'success',
      data: data,
    })
  }
})
app.use('/', async (c, next) => {
  // inject css
  c.res.headers.append('Content-Type', 'text/html')
  await next()
})
// Routes
Routes.forEach((route) => {
  app.openapi(route.route, (c) => {
    return route.handler(c)
  })
})
// Swagger UI
app.get(
  '/',
  swaggerUI({
    url: '/doc',
  })
)
// OpenAPI Docs
app.doc('/doc', {
  openapi: '3.1.0',
  servers: [
    {
      description: 'Development',
      url: 'http://localhost:3000',
    },
    {
      description: 'Production',
      url: 'https://api.fantasyvlr.xyz',
    },
  ],
  info: {
    title: 'Vlr API',
    contact: {
      name: 'Cody Krist',
      url: 'https://discord.gg/5drhYDQuQm',
    },
    version: 'v0.1',
  },
})
// Connect to Redis
client.connect().then(() => {
  console.log('Redis connected!')
  client.flushAll().then(() => {
    console.log('Cleared Cache')
  })
})
export default app
