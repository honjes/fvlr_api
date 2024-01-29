// Vlr2 API with HONO and Redis
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { Routes } from './routes/router'
import { createClient } from 'redis'
import 'dotenv/config'
const DB_URI = process.env.DB_URI || 'redis://redis:6379'
const PORT = process.env.PORT || 3000
// Initial Setup
const app = new OpenAPIHono()
const client = createClient({
  url: DB_URI,
})
let CacheEnabled = true
let ConnectionCount = 0
// CORS
app.use(
  '*',
  cors({
    origin: '*',
  })
)
// Caching
app.use('*', async (c, next) => {
  // Set a Default Return Value
  const DefaultResult = {
    cached: false,
    status: 'success',
    data: {},
  }

  if (!CacheEnabled) {
    await next()
    const data = await c.res.json()
    c.res = c.json(Object.assign(DefaultResult, { cached: false, data }))
    return
  }
  // Reject Blacklisted Routes
  if (
    c.req.path.includes('favicon.ico') ||
    c.req.path === '' ||
    c.req.path === '/' ||
    c.req.path === '/doc'
  ) {
    await next()
    return
  }
  console.log(c.req.path)

  // Cached Response
  if (await client.exists(c.req.path)) {
    console.log('Cached Response')
    const cachedData = await client.get(c.req.path) // .001ms
    if (cachedData === null) return // Should never happen
    let cachedResponse
    // Clear the Cache if the data is not valid JSON
    try {
      cachedResponse = JSON.parse(cachedData)
    } catch {
      // Clear Cache and close the request
      client.del(c.req.path)
      await next()
      return
    }
    // Return the Cached Response
    // If the Cached Response was an error, we Overwrite the fields
    if (cachedResponse.status === 'error') {
      c.res = c.json(
        Object.assign(DefaultResult, {
          cached: true,
          status: 'error',
          message: cachedResponse.message,
        })
      )
    }
    // Otherwise we return the cached response normally
    else {
      c.res = c.json(
        Object.assign(DefaultResult, {
          cached: true,
          data: cachedResponse,
        })
      )
    }
    return
  }
  // Non-Cached Response
  else {
    console.log('Not Cached Response')
    // Let the page generate as normal
    await next()
    // Intercept the JSON
    const data = await c.res.json()
    // Cache the response
    const cacheLifespan = () => {
      switch (c.req.path.split('/')[1]) {
        case 'matches':
          return 60 * 60 * 2 // 2 Hours
        default:
          return 60
      }
    }
    client.setEx(c.req.path, cacheLifespan(), JSON.stringify(data))
    // Check if it was an Error
    if (data.status === 'error') {
      c.res = c.json(
        Object.assign(DefaultResult, {
          cached: false,
          status: data.status,
          message: data.message,
        })
      )
      return
    }
    // Otherwise return the data
    else {
      c.res = c.json(Object.assign(DefaultResult, { cached: false, data }))
      return
    }
  }
})

app.use('/', async (c, next) => {
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

// JSON errors
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({
    status: 'error',
    message: `${err}`,
  })
})

// Connect to Redis
const RedisConnect = async () => {
  client
    .connect()
    .then(() => {
      console.log('Redis connected!')
      client.flushAll().then(() => {
        console.log('Cleared Cache')
      })
      CacheEnabled = true
    })
    .catch((err) => {
      ConnectionCount++
      console.log('Redis Connection Error: Attempt ' + ConnectionCount)
      console.log('Caching Disabled')
      CacheEnabled = false
      if (ConnectionCount > 3) {
        console.log('Redis Connection Error: Max Attempts Reached')
        console.log('Caching Permanently Disabled')
        return
      } else {
        setTimeout(() => {
          RedisConnect()
        }, 5000)
      }
    })
}
RedisConnect()
// Start the server
export default {
  port: PORT,
  ...app,
}
