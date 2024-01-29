import { fetchOneMatch } from "./one"

type ScoresObject = {
    [index: string]:Number
}
type PlayerScoreObject = {
    name: String,
    score: Number
}

const generateScore = async (id: string) => {
    const match = await fetchOneMatch(id);
    const scores_object: ScoresObject = {};
    const scores_array: PlayerScoreObject[] = [];
    // Itterate through the players, generate score based on formula
    match.players.forEach((player)=>{
        let score = 0;
        score += Number(player.stats.acs);
        score += Number(player.stats.k) * 4;
        score -= Number(player.stats.d) * 3;
        score += Number(player.stats.a) * 2;
        score += Number(player.stats.fk) * 5;
        score -= Number(player.stats.fd) * 4;
        scores_object[player.name] = score;
        scores_array.push({"name": player.name, "score": score})
    })
    return {
        id,
        scores_array,
        scores_object,
        match
    };
}

export {generateScore}