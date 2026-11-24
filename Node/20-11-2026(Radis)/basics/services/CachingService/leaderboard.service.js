
import redis from "../config/redis.js";

const LEADERBOARD_KEY = "game:leaderboard";

class LeaderboardService {
    // Add or update a player's score
    async addScore(playerId, score) {
        return await redis.zadd(
            LEADERBOARD_KEY,
            score,
            playerId
        );
    }

    // Get top 10 players
    async getTopPlayers() {
        const result = await redis.zrevrange(
            LEADERBOARD_KEY,
            0,
            9,
            "WITHSCORES"
        );

        const players = [];

        for (let i = 0; i < result.length; i += 2) {
            players.push({
                playerId: result[i],
                score: Number(result[i + 1])
            });
        }

        return players;
    }

    // Get player's position (1-based, highest score first)
    async getPlayerRank(playerId) {
        const rank = await redis.zrevrank(
            LEADERBOARD_KEY,
            playerId
        );

        return rank === null ? null : rank + 1;
    }

    // Get player's score
    async getPlayerScore(playerId) {
        const score = await redis.zscore(
            LEADERBOARD_KEY,
            playerId
        );

        return score === null ? null : Number(score);
    }

    // Increase player's score
    async increaseScore(playerId, points) {
        return await redis.zincrby(
            LEADERBOARD_KEY,
            points,
            playerId
        );
    }
}

export default new LeaderboardService();
