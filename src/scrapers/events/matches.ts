// Fetches details on a single event

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { EventMatches, typeEnum } from '../../schemas/schemas'
import { PORT } from '../..'

const fetchEventMatches = async (id: string): Promise<EventMatches> => {
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
        const Event = {} as EventMatches
        Event.type = typeEnum.Enum.Event
        Event.name = $('h1.wf-title').text().trim()
        Event.link = `https://www.vlr.gg/event/${id}`
        Event.id = idGenerator(id)
        Event.img =
          'https:' + $('.wf-avatar.event-header-thumb img').attr('src')

        // Pull all match IDs
        const matchIDs = new Array()
        $('a.match-item').each((i, element) => {
          const matchID = $(element).attr('href')
          if (matchID) {
            matchIDs.push(matchID.split('/')[1])
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
