// Vlr2 API with HONO and Redis
import { Context, Hono } from 'hono'
import { createClient } from 'redis';
// Scrapers
import {fetchAllEvents} from './scrapers/events/all';
// Types
import Response from './types/response';
// Initial Setup
const client = createClient();
const app = new Hono()
// MiddleWare
app.use((c, next) => {
    return next();
})
// Routes
app.get("/events", async (c: Context) => {
    const events = await fetchAllEvents();
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
client.connect().then(() => console.log('Redis connected!'));





export default app