import { connectDb } from "@/utils/db";
import { Game } from "@/models/gameSchema";
import { NextResponse } from "next/server";

// Define interface for context
interface GameContext {
    params: {
        gameId: string;
    };
}

/**
 * @swagger
 * /api/games/{gameId}:
 *   get:
 *     summary: Get a single game
 *     description: Retrieve the details of a specific game by its ID.
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: The unique ID of the game to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the game.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 singleGame:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     standard:
 *                       type: number
 *                     subject:
 *                       type: string
 *                     chapter:
 *                       type: string
 *                     exercise:
 *                       type: number
 *                     description:
 *                       type: string
 *                     difficulty:
 *                       type: string
 *                     timeLimit:
 *                       type: number
 *                     status:
 *                       type: string
 *                     numberLevels:
 *                       type: number
 *                    thumbnail:
 *                      type: string
 *                    src:
 *                     type: string
 *       400:
 *         description: Validation error or missing Game ID.
 *       404:
 *         description: Game not found.
 *       500:
 *         description: Server error.
 */
export async function GET(req: Request, context: GameContext) {
    try {
        await connectDb();

        const { gameId } = await context.params;

        if (!gameId) {
            return NextResponse.json(
                { success: false, error: "Game ID is required" },
                { status: 400 }
            );
        }

        const singleGame = await Game.findById(gameId);

        if (!singleGame) {
            return NextResponse.json(
                { success: false, error: "Game not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, singleGame },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving single game:", error);
        return NextResponse.json(
            { success: false, error: "Failed to retrieve the single game" },
            { status: 500 }
        );
    }
}
