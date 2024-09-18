// Fetches all events from the /events page

// External Libs
import { load } from 'cheerio'
import { cleanPhoto, idGenerator } from '../util'
// Schema
import { z } from '@hono/zod-openapi'
import { shortEventSchema, regionsEnum, typeEnum } from '../../schemas/schemas'
// Type
export type ShortEvent = z.infer<typeof shortEventSchema>
export type ShortEventElement = z.infer<typeof shortEventSchema.element>

const fetchAllEvents = (page: number = 1): Promise<ShortEvent> => {
  return new Promise((resolve, reject) => {
    const events: ShortEvent = []
    fetch(`https://www.vlr.gg/events/?page=${page}`)
      .then((response) => response.text())
      .then((data) => {
        const $ = load(data)
        $('.event-item').each((i, element) => {
          const eventLink = `https://www.vlr.gg` + $(element).attr('href')
          const eventDate = $(element)
            .find('.event-item-desc-item.mod-dates')
            .text()
            .trim()
            .split('\t')[0]
          const eventStatus = $(element)
            .find('.event-item-desc-item-status')
            .text()
            .trim()
          const eventPrize = $(element)
            .find('.event-item-desc-item.mod-prize')
            .text()
            .trim()
            .split('\t')[0]
          const eventRegion = regionsEnum.parse(
            $(element)
              .find('.event-item-desc-item.mod-location > i')
              .attr('class')
              ?.split(' ')[1]
              .split('-')[1]
              .toUpperCase()
          )
          const eventLogo = cleanPhoto(
            $(element).find('.event-item-thumb > img').attr('src') || ''
          )

          console.log('Event Link: ', eventLink)
          events.push({
            type: typeEnum.Enum.Event,
            link: eventLink,
            id: idGenerator(eventLink.split('/')[4]),
            name: $(element).find('.event-item-title').text().trim(),
            date: eventDate,
            status: eventStatus,
            prize: eventPrize,
            region: eventRegion,
            logo: eventLogo,
          })
        })
        resolve(events)
      })
  })
}

export { fetchAllEvents }
