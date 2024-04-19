// Fetches all matches from the /matches route

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
import { fetchOneMatch } from './one'
// Schema
import { z } from '@hono/zod-openapi'
import { AllMatchSchema } from '../../schemas/match'
import { logStats } from '../..'
// Type
export type AllMatches = z.infer<typeof AllMatchSchema>

const fetchAllMatches = async (): Promise<AllMatches> => {
  return new Promise(async (resolve, reject) => {
    // fetch the page
    fetch(`https://www.vlr.gg/matches`)
      .then((response) => response.text())
      .then((data) => {
        // parse the page
        let $ = load(data)
        let Matches: AllMatches = new Array()
        const Labels = $(
          '#wrapper > div.col-container > div:nth-child(1) > .wf-label.mod-large'
        )
        const MatchContainer = $(
          '#wrapper > div.col-container > div:nth-child(1) > .wf-card[style="margin-bottom: 30px;"]'
        )
        Labels.each((i, element) => {
          const today =
            $(element).text().trim().split('\n').length > 1 ? true : false
          Matches.push({
            date: $(element).text().trim().split('\n')[0].trim(),
            today,
            matches: new Array(),
          })
        })
        const MatchPulls = new Array()
        MatchContainer.each((i, container) => {
          // Pull Matches from the container
          $(container)
            .find('a')
            .each((index, match) => {
              const link = $(match).attr('href')
              if (!link) return
              const id = idGenerator(link.split('/')[1])
              // Should run this through the cache instead,
              // Fix later
              MatchPulls.push(
                fetchOneMatch(id).then((data) => {
                  Matches[i].matches.push(data)
                  return true
                })
              )
            })
        })
        // Get all of the children divs

        // Build the Matches Object
        Promise.all(MatchPulls).then(() => {
          logStats.crawledSites++
          resolve(Matches)
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { fetchAllMatches }
