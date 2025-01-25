import { connectDb } from "@/utils/db";
import { GameProgress } from "@/models/studentGameProgressSchema";
import { NextResponse } from "next/server";

// Define interface for context
interface GameProgressContext {
    params: {
        gameId: string;
        playerId: string;
    };
}

/**
 * @swagger
 * /api/gameProgress/{playerId}/{gameId}:
 *   get:
 *     summary: Retrieve game progress for a specific player and game
 *     description: Fetches the game progress details for a given player ID and game ID.
 *     tags:
 *       - Game Progress
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game.
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player.
 *     responses:
 *       200:
 *         description: Game progress retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 gameProgress:
 *                   $ref: '#/components/schemas/GameProgress'
 *       400:
 *         description: Missing required parameters.
 *       404:
 *         description: Game progress not found.
 *       500:
 *         description: Server error while retrieving game progress.
 */

export async function GET(req: Request, context: GameProgressContext) {
    try {
        await connectDb();
        const { gameId, playerId } = await context.params;

        if (!playerId || !gameId) {
            return NextResponse.json(
                { success: false, error: "Game ID and Player ID are required" },
                { status: 400 }
            );
        }
        const gameProgress = await GameProgress.findOne({ gameId, playerId });
        if (!gameProgress) {
            return NextResponse.json(
                {
                    success: false,
                    error: "GameProgress not found for provided Player ID",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, gameProgress },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving game progress:", error);
        return NextResponse.json(
            { success: false, error: "Failed to retrieve game progress" },
            { status: 500 }
        );
    }
}
