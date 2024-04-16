// Fetches details on a single team

// External Libs
import { load } from 'cheerio'
import { idGenerator } from '../util'
import { PORT } from '../..'
import { Player, Team } from '../../schemas/schemas'

const fetchOneTeam = async (id: string): Promise<Team> => {
  return new Promise(async (resolve, reject) => {
    // fetch the page
    fetch(`https://www.vlr.gg/team/${id}`)
      .then((response) => response.text())
      .then(async (data) => {
        // parse the page
        const $ = load(data)
        // Check for the 404 string
        if (
          $('#wrapper > .col-container > div:first-child')
            .text()
            .includes('Page not found')
        )
          reject('404')
        let Team = new Object() as Team
        // Team Name,, Logo, Region, Socials, Roster, Staff, Earnings
        Team.name = $('h1.wf-title').text().trim()
        Team.tag = $('h2.wf-title.team-header-tag').text().trim()
        Team.logo = `https:${$('.team-header img').attr('src')}`
        Team.id = id
        Team.country = $('.team-header-country').text().trim()
        Team.link = `https://vlr.gg/team/${id}`
        Team.socials = new Array()
        // TODO: Does not work
        Team.earnings = $('.team-earnings-value').text().trim()

        // Fix Logo
        if (Team.logo.includes('/img/vlr/tmp/vlr.png'))
          Team.logo = 'https://www.vlr.gg/img/vlr/tmp/vlr.png'
        // Get Socials
        $('.team-header-links a').each((i, element) => {
          let socialLink = $(element).attr('href')
          if (socialLink === '' || socialLink === undefined) return
          // add https if not there
          if (!socialLink.includes('https://'))
            socialLink = 'https://' + socialLink
          let socialURL
          try {
            socialURL = new URL(socialLink)
          } catch {
            console.error(
              'Error setting socialURL: ' + socialLink + ' | Page: ',
              false
            )
            console.info('FUCKING SOCIAL LINKS CAN SUCK MY ASS')
            process.exit()
            return
          }
          const socialName = socialURL.hostname
          Team.socials.push({ name: socialName, link: socialLink })
        })
        // Generaate Players and Staff
        const players_item: any[] = new Array()
        Team.staff_item = new Array()
        $('.team-roster-item').each((i, element) => {
          const playerLink = $(element).find('.team-roster-item a').attr('href')
          if (playerLink === '' || playerLink === undefined) return
          const playerURL = new URL(playerLink, 'https://www.vlr.gg')
          const playerId = playerURL.pathname.split('/')[2]
          const playerIgn = $(element)
            .find('.team-roster-item-name-alias')
            .text()
            .trim()
          const playerRealName = $(element)
            .find('.team-roster-item-name-real')
            .text()
            .trim()
          let playerRole = $(element)
            .find('.team-roster-item-name-role')
            ?.text()
            .trim()
          if (playerRole === '' || playerRole === undefined) {
            playerRole = 'player'
            players_item.push({
              ign: playerIgn,
              link: `https://www.vlr.gg${playerLink}`,
              id: idGenerator(playerId),
              role: playerRole,
            })
          } else {
            Team.staff_item.push({
              ign: playerIgn,
              link: `https://www.vlr.gg${playerLink}`,
              id: idGenerator(playerId),
              role: playerRole,
            })
          }
        })

        // SICK way of keeping players cached ;)
        const playerPromises = [
          ...players_item.map((player) => {
            return fetch(`http://localhost:${PORT}/player/${player.id}`)
          }),
          ...Team.staff_item.map((player) => {
            return fetch(`http://localhost:${PORT}/player/${player.id}`)
          }),
        ]
        let players = await Promise.all(playerPromises)
        players = await Promise.all(players.map((res) => res.json()))
        Team.players = players.map((player: any) => player.data)

        // Generate team.staff array of ids
        Team.staff = new Array()
        Team.staff_item.forEach((player) => {
          Team.staff.push(idGenerator(player.id))
        })

        resolve(Team)
      })
      .catch((err) => {
        console.error(err)
        // if 404 then return a custom error
        if (err.response.status == 404) {
          reject(new Error('Team Not Found'))
        } else {
          reject(err)
        }
      })
  })
}

export { fetchOneTeam }
