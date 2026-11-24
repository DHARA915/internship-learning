
import leaderboardService from "../services/leaderboard.service.js";

export default async function run() {
    // Add players
    await leaderboardService.addScore("player:101", 450);
    await leaderboardService.addScore("player:102", 800);
    await leaderboardService.addScore("player:103", 650);
    await leaderboardService.addScore("player:104", 950);
    await leaderboardService.addScore("player:105", 300);
    await leaderboardService.addScore("player:106", 700);

    console.log("Players added successfully!");

    // Get top 10 players
    const topPlayers = await leaderboardService.getTopPlayers();

    console.log("\nLeaderboard:");
    console.table(topPlayers);

    // Get player rank
    const rank = await leaderboardService.getPlayerRank("player:103");

    console.log("Player 103 Rank:", rank);

    // Get player score
    const score = await leaderboardService.getPlayerScore("player:103");

    console.log("Player 103 Score:", score);

    // Increase player score
    await leaderboardService.increaseScore("player:103", 200);

    // Updated leaderboard
    const updatedPlayers = await leaderboardService.getTopPlayers();

    console.log("\nUpdated Leaderboard:");
    console.table(updatedPlayers);
}
