// Request All Teams for an Event

import { EventTeams } from '../../schemas/events'
import { requestSelf } from '../util'
import { Event } from '../../schemas/events'
import { Team } from '../../schemas/teams'

export interface FetechEventTeamsOptions {}

export function fetchEventTeams(
  id: string,
  options?: FetechEventTeamsOptions
): Promise<EventTeams> {
  const defaultOptions: FetechEventTeamsOptions = {}

  return new Promise(async (resolve, reject) => {
    const eventData = await requestSelf<Event>(`event/${id}`)

    const teamData = await requestSelf<Team[]>(
      eventData.teams_item.map((team) => `team/${team.id}`)
    )
    resolve({ ...eventData, teams: teamData })
  })
}
