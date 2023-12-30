// Vlr2 API with HONO and Redis
import { Context, Hono } from 'hono'
import { createClient } from 'redis';
// Scrapers
import {fetchAllEvents} from './scrapers/events/all';
// Types
import Response from './types/response';
import { fetchOneEvent } from './scrapers/events/one';
// Initial Setup
const client = createClient();
const app = new Hono()
// MiddleWare
app.use("*", async (c, next) => {
    // Check if the request is in the Redis Cache, if not then continue, if so then return the cached response
    console.log(c.req.path);
    if(c.req.path.includes("favicon.ico")) next();
    else if( await client.exists(c.req.path) ) {
        console.log("Cached Response");
        const data = await client.get(c.req.path);
        return c.json<Response>({
            cached: true,
            status: 'success',
            data: JSON.parse(data)
        })
    } else {
        console.log("Not Cached Response");
        await next();
        // Cache the response
        const data = await c.res.json();
        client.setEx(c.req.path, 60, JSON.stringify(data));
        c.res = c.json<Response>({
            cached: false,
            status: 'success',
            data: data
        });
    }
})

// Routes
app.get("/events", async (c: Context) => {
    const events = await fetchAllEvents();
    return c.json<Response>({
        status: 'success',
        data: events
    })
});
app.get("/event/:id", async (c: Context) => {
    const events = await fetchOneEvent(c.req.param('id'));
    return c.json<Response>({
        status: 'success',
        data: events
    })
});

app.notFound((c)=>{
    return c.json<Response>({
        status: 'fail',
        error: 'Not Found'
    })
})
client.connect().then(() => {
    console.log('Redis connected!')
    client.flushAll().then(()=>{
        console.log("Cleared Cache");
    })
});

export default app