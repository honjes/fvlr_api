// Fetches details on a single event

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { PORT } from '../..'
import { typeEnum } from '../../schemas/enums'
import { EventMatches } from '../../schemas/events'

export interface FetchEventMatchesOptions {
  ext?: boolean
}

const fetchEventMatches = async (
  id: string,
  options: FetchEventMatchesOptions
): Promise<EventMatches> => {
  const optionsDefault: FetchEventMatchesOptions = {
    ext: false,
  }
  const { ext } = { ...optionsDefault, ...options }
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

        // request all match data from the API
        let matches = await Promise.all(
          matchIDs.map((matchId) => {
            return fetch(
              `http://localhost:${PORT}/match/${matchId}?ext=${
                ext ? 'true' : 'false'
              }&includePlayers=false`
            )
          })
        )
        matches = await Promise.all(matches.map((res) => res.json()))
        Event.matches = matches.map((match: any) => match.data)

        resolve(Event)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { fetchEventMatches }
