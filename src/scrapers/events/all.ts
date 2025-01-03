// Fetches all events from the /events page

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
// Schema
import { z } from '@hono/zod-openapi'
import { shortEventSchema, regionsEnum, typeEnum } from '../../schemas/schemas'
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
          const link = `https://www.vlr.gg` + $(element).attr('href')
          const eventItem: ShortEventElement = {
            type: typeEnum.Enum.Event,
            id: idGenerator(link.split('/')[4]),
            link: link,
            name: $(element).find('.event-item-title').text().trim(),
            date: $(element)
              .find('.event-item-desc-item.mod-dates')
              .text()
              .trim()
              .split('\t')[0],
            status: $(element)
              .find('.event-item-desc-item-status')
              .text()
              .trim(),
            prize: $(element)
              .find('.event-item-desc-item.mod-prize')
              .text()
              .trim()
              .split('\t')[0],
            region: regionsEnum.parse(
              $(element)
                .find('.event-item-desc-item.mod-location > i')
                .attr('class')
                ?.split(' ')[1]
                .split('-')[1]
                .toUpperCase()
            ),
            logo:
              'https:' + $(element).find('.event-item-thumb > img').attr('src'),
          }
          // Check if logo is https
          if (!eventItem.logo.includes('https://')) {
            // Check if it has 1 slash or none
            if (eventItem.logo.includes('https:/')) {
              // It has 1 slash, add another
              eventItem.logo = eventItem.logo.replace('https:/', 'https://')
            } else {
              // It has no slashes, add 2
              eventItem.logo = eventItem.logo.replace('https:', 'https://')
            }
          }
          Events.push(eventItem)
        })
        resolve(Events)
      })
  })
}

export { fetchAllEvents }
