// Request all Players for an Event

import { EventPlayers } from '../../schemas/events'
import { Player } from '../../schemas/player'
import { requestSelf } from '../util'
import { Event } from '../../schemas/events'

export interface FetchEventPlayersOptions {}

export function fetchEventPlayers(
  id: string,
  options?: FetchEventPlayersOptions
): Promise<EventPlayers> {
  const defaultOptions: FetchEventPlayersOptions = {}

  return new Promise(async (resolve, reject) => {
    const eventData = await requestSelf<Event>(`event/${id}`)

    const playerData = await requestSelf<Player[]>(
      eventData.players_item.map((player) => `player/${player.id}`)
    )
    resolve({ ...eventData, players: playerData })
  })
}
