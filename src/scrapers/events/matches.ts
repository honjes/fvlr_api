// Fetches details on a single event

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { z } from '@hono/zod-openapi'
import { EventSchema } from '../../schemas/schemas'
import { fetchOneMatch } from '../matches/one'
import { generateScore } from '../matches/score'
// Type
type Event = z.infer<typeof EventSchema>

const fetchEventMatches = async (id: string): Promise<Object> => {
  // Validate input
  // make sure id is a string of numbers
  if (!id.match(/^[0-9]+$/)) throw new Error('Invalid ID')
  return new Promise(async (resolve, reject) => {
    // fetch the page
    fetch(`https://www.vlr.gg/event/matches/${id}`)
      .then((response) => response.text())
      .then(async (data) => {
        // parse the page
        const $ = load(data)
        if (
          $('#wrapper > .col-container > div:first-child')
            .text()
            .includes('Page not found')
        )
          reject('404')
        const Event = {} as Event
        Event.type = 'event'
        Event.name = $('h1.wf-title').text().trim()
        Event.link = `https://www.vlr.gg/event/${id}`
        Event.id = id
        Event.img =
          'https:' + $('.wf-avatar.event-header-thumb img').attr('src')

        // Pull all match IDs
        const MatchIDs = new Array()
        $('a.match-item').each((i, element) => {
          const matchID = $(element).attr('href')
          if (matchID) {
            MatchIDs.push(matchID.split('/')[1])
          }
        })

        // Optimize this to go through the cache at a later point
        const MatchFetchPromises = new Array()
        for (let i = 0; i < MatchIDs.length; i++) {
          MatchFetchPromises.push(generateScore(MatchIDs[i]))
        }
        Event.matches = await Promise.all(MatchFetchPromises)

        resolve(Event)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { fetchEventMatches }
