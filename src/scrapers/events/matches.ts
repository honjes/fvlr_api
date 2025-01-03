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
        const event: EventMatches = {
          type: typeEnum.Enum.Event,
          name: $('h1.wf-title').text().trim(),
          link: `https://www.vlr.gg/event/${id}`,
          id: idGenerator(id),
          img: 'https:' + $('.wf-avatar.event-header-thumb img').attr('src'),
          matches: [],
        }
        // Pull all match IDs
        const matchIDs = new Array()
        $('a.match-item').each((i, element) => {
          const matchID = $(element).attr('href')
          if (matchID) {
            matchIDs.push(matchID.split('/')[1])
          }
        })

        // request all match data from the API
        let matches = await Promise.all(
          matchIDs.map((matchId) => {
            return fetch(`http://localhost:${PORT}/match/${matchId}`)
          })
        )
        matches = await Promise.all(matches.map((res) => res.json()))
        event.matches = matches.map((match: any) => match.data)

        resolve(event)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { fetchEventMatches }
