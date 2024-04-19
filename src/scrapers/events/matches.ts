// Fetches details on a single event

// External Libs
import { load } from 'cheerio'
import { idGenerator, requestSelf } from '../util'
// Schema
import { typeEnum } from '../../schemas/enums'
import { EventMatches } from '../../schemas/events'
import { Match } from '../../schemas/match'

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
        Event.matches = await requestSelf<Match[]>(
          matchIDs.map(
            (id) =>
              `match/${id}?ext=${ext ? 'true' : 'false'}&includePlayers=false`
          )
        )

        resolve(Event)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { fetchEventMatches }
