import {
  EventFull,
  EventMatches,
  EventPlayers,
  EventTeams,
  Event,
} from '../../schemas/events'
import { requestSelf } from '../util'

export interface FetchFullEventOptions {}

export async function fetchEventFull(
  id: string,
  options?: FetchFullEventOptions
): Promise<EventFull> {
  return new Promise(async (resolve, reject) => {
    const baseEvent = await requestSelf<Event>(`event/${id}`)
    const eventMatches = await requestSelf<EventMatches>(`event/${id}/matches`)
    const eventTeams = await requestSelf<EventTeams>(`event/${id}/teams`)
    const eventPlayers = await requestSelf<EventPlayers>(`event/${id}/players`)

    resolve({
      ...baseEvent,
      matches: eventMatches.matches,
      teams: eventTeams.teams,
      players: eventPlayers.players,
    })
  })
}
