// Fetches details on a single event

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
import { typeEnum, statusEnum } from '../../schemas/enums'
import { Event } from '../../schemas/events'
// Schema

const fetchOneEvent = async (id: string): Promise<Event> => {
  return new Promise(async (resolve, reject) => {
    // fetch the page
    fetch(`https://www.vlr.gg/event/${id}`)
      .then((response) => response.text())
      .then((data) => {
        // parse the page
        const $ = load(data)
        if (
          $('#wrapper > .col-container > div:first-child')
            .text()
            .includes('Page not found')
        )
          reject('404')
        const Event = {} as Event
        Event.type = typeEnum.Enum.Event
        Event.name = $('h1.wf-title').text().trim()
        Event.link = `https://www.vlr.gg/event/${id}`
        Event.id = id
        Event.logo =
          'https:' + $('.wf-avatar.event-header-thumb img').attr('src')
        // get status of the event
        // TODO: implement check for ongoing events
        Event.status =
          $(
            '.event-content > div.wf-card table tbody tr:first-of-type td:nth-of-type(3)'
          )
            .text()
            .trim() == 'TBD'
            ? statusEnum.Enum.Upcoming
            : statusEnum.Enum.Completed
        // Get all teams
        const Teams = new Array()
        $('.event-team').each((i, element) => {
          const team = new Object() as Event['teams_item'][0]
          try {
            team.name = $(element).find('.event-team-name').text().trim()
            team.logo =
              $(element).find('.event-team-players-mask > img').attr('src') ||
              ''
            // when no logo is found, use the full vlr logo url
            team.logo = team.logo.replace(
              '/img/vlr/tmp/vlr.png',
              'https://www.vlr.gg/img/vlr/tmp/vlr.png'
            )
            team.link = $(element).find('.event-team-name').attr('href') || ''
            team.id = idGenerator(team.link.split('/')[2])
            team.players = new Array()
            team.status = 'ok'
            Teams.push(team)
          } catch (err) {
            team.status = 'error'
            Teams.push(team)
          }
        })

        // Get all players
        const Players = new Array()
        const FailedLinks = new Array()
        $('.event-team-players-item').each((i, element) => {
          const playerLink = $(element).attr('href') || ''
          let playerId
          try {
            playerId = idGenerator(playerLink.split('/')[2])
          } catch (err) {
            // Player ID does not exist, just return
            return
          }
          if (playerId === null || playerId === undefined) return
          const playerIgn = $(element).text().trim()
          const playerTeamName = $(element)
            .parent()
            .parent()
            .find('.event-team-name')
            .text()
            .trim()
          const playerTeamId = idGenerator(
            (
              $(element)
                .parent()
                .parent()
                .find('.event-team-name')
                .attr('href') || ''
            ).split('/')[2]
          )
          for (let i = 0; i < Teams.length; i++) {
            if (Teams[i].name == playerTeamName) {
              Teams[i].players.push({
                type: 'player',
                ign: playerIgn,
                link: `https://www.vlr.gg${playerLink}`,
                id: playerId,
              })
            }
          }
          Players.push({
            type: 'player',
            name: playerIgn,
            ign: playerIgn,
            link: `https://www.vlr.gg${playerLink}`,
            id: playerId,
            team: {
              type: 'team',
              name: playerTeamName,
              id: playerTeamId,
            },
          })
        })

        Event.teams_item = Teams
        Event.players_item = Players
        Event.failed_links = FailedLinks
        resolve(Event)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { fetchOneEvent }
