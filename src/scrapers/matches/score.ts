// Schema
import { z } from '@hono/zod-openapi'
import {
  MatchSchema,
  PlayerMatchStats,
  PlayerMatchStatsElement,
} from '../../schemas/match'
import { Score } from '../../schemas/score'
import { requestSelf } from '../util'
// Types
type Match = z.infer<typeof MatchSchema>

const generateScore = async (id: string): Promise<Score> => {
  const match = await requestSelf<Match>(`match/${id}`)
  const scores_object: Score['scores_object'] = {}
  const scores_array: Score['scores_array'] = []
  // Itterate through the players, generate score based on formula
  const players = match.players as PlayerMatchStats
  players.forEach((player: PlayerMatchStatsElement) => {
    let score = 0
    score += Number(player.stats.acs)
    score += Number(player.stats.k) * 4
    score -= Number(player.stats.d) * 3
    score += Number(player.stats.a) * 2
    score += Number(player.stats.fk) * 5
    score -= Number(player.stats.fd) * 4
    scores_object[player.name] = score
    scores_array.push({ name: player.name, score: score })
  })
  return {
    id,
    scores_array,
    scores_object,
    match,
  }
}

export { generateScore }
