import Route from '../types/route';
import { fetchAllEvents } from '../scrapers/events/all';
export const routes: Route[] = [
    {
        method: 'get',
        path: '/',
        name: 'home',
        scraper: new Promise((res,rej) => res({"Done": "Done"}))
    },
    {
        method: 'get',
        path: '/events',
        name: 'events',
        scraper: fetchAllEvents
    },
    {
        method: 'get',
        path: '/test',
        name: 'home',
        scraper: new Promise((res,rej) => res({"test": "test"}))
    }
];