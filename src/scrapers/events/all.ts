// Fetches all events from the /events page

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { z } from '@hono/zod-openapi'
import { typeEnum, regionsEnum } from '../../schemas/enums'
import { shortEventSchema } from '../../schemas/events'
import { logStats } from '../..'
// Type
export type ShortEvent = z.infer<typeof shortEventSchema>
export type ShortEventElement = z.infer<typeof shortEventSchema.element>

const fetchAllEvents = (page: number = 1): Promise<ShortEvent> => {
  return new Promise((resolve, reject) => {
    const Events: ShortEvent = []
    fetch(`https://www.vlr.gg/events/?page=${page}`)
      .then((response) => response.text())
      .then((data) => {
        const $ = load(data)
        $('.event-item').each((i, element) => {
          const Event = {} as ShortEventElement
          Event.type = typeEnum.Enum.Event
          Event.link = `https://www.vlr.gg` + $(element).attr('href')
          Event.id = idGenerator(Event.link.split('/')[4])
          Event.name = $(element).find('.event-item-title').text().trim()
          Event.date = $(element)
            .find('.event-item-desc-item.mod-dates')
            .text()
            .trim()
            .split('\t')[0]
          Event.status = $(element)
            .find('.event-item-desc-item-status')
            .text()
            .trim()
          Event.prize = $(element)
            .find('.event-item-desc-item.mod-prize')
            .text()
            .trim()
            .split('\t')[0]
          Event.region = regionsEnum.parse(
            $(element)
              .find('.event-item-desc-item.mod-location > i')
              .attr('class')
              ?.split(' ')[1]
              .split('-')[1]
              .toUpperCase()
          )
          Event.logo =
            'https:' + $(element).find('.event-item-thumb > img').attr('src')
          if (!Event.logo.includes('https://')) {
            // Check if it has 1 slash or none
            if (Event.logo.includes('https:/')) {
              // It has 1 slash, add another
              Event.logo = Event.logo.replace('https:/', 'https://')
            } else {
              // It has no slashes, add 2
              Event.logo = Event.logo.replace('https:', 'https://')
            }
          }
          Events.push(Event)
        })
        logStats.crawledSites++
        resolve(Events)
      })
  })
}

export { fetchAllEvents }
