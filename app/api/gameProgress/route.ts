import { connectDb } from "@/utils/db";
import { GameProgress } from "@/models/studentGameProgressSchema";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/gameProgress:
 *   post:
 *     summary: Create or update game progress
 *     description: Create a new game progress record or update an existing one based on player ID and game ID.
 *     tags:
 *       - Game Progress
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameProgressId:
 *                 type: string
 *                 description: (Optional) ID of the existing game progress record to update the record.
 *               playerId:
 *                 type: string
 *                 description: ID of the player.
 *               gameId:
 *                 type: string
 *                 description: ID of the game.
 *               current_lvl:
 *                 type: number
 *                 description: Current level of the player in the game.
 *               rank:
 *                 type: number
 *                 description: Player's rank in the game.
 *               score:
 *                 type: number
 *                 description: Player's score in the game.
 *               attempts:
 *                 type: number
 *                 description: Number of attempts the player has made.
 *               time_taken:
 *                 type: number
 *                 description: Time taken to complete the game (in seconds).
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time when the game was completed.
 *               rewardType:
 *                 type: string
 *                 description: Type of reward given to the player.
 *               awardedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time when the reward was awarded.
 *     responses:
 *       201:
 *         description: Game progress created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/GameProgress'
 *       200:
 *         description: Game progress updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/GameProgress'
 *       400:
 *         description: Validation error or missing required fields.
 *       404:
 *         description: Game progress not found during update.
 */
export async function POST(req: Request) {
    try {
        await connectDb();

        const {
            gameProgressId,
            playerId,
            gameId,
            current_lvl,
            rank,
            score,
            attempts,
            time_taken,
            completedAt,
            rewardType,
            awardedAt,
        } = await req.json();

        const gameProgressExists = await GameProgress.findOne({
            gameId,
            playerId,
        });

        // Directly update game progress if a record with provided playerId and gameId already exists
        if (gameProgressId || gameProgressExists) {
            const id = gameProgressId
                ? gameProgressId
                : gameProgressExists?._id;
            const updatedFields = {
                ...(current_lvl !== undefined && { current_lvl }),
                ...(rank !== undefined && { rank }),
                ...(score !== undefined && { score }),
                ...(attempts !== undefined && { attempts }),
                ...(time_taken !== undefined && { time_taken }),
                ...(completedAt && { completedAt }),
                ...(rewardType && { rewardType }),
                ...(awardedAt && { awardedAt }),
            };

            const updatedGameProgress = await GameProgress.findByIdAndUpdate(
                id,
                updatedFields,
                { new: true, runValidators: true }
            );
            if (!updatedGameProgress) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Game progress not found or could not be updated.",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    message: "Game progress updated successfully.",
                    data: updatedGameProgress,
                },
                { status: 200 }
            );
        }

        if (!playerId || !gameId || current_lvl === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Player ID, Game ID and Current Level are required fields.",
                },
                { status: 400 }
            );
        }

        const newGameProgress = new GameProgress({
            playerId,
            gameId,
            current_lvl,
            rank: rank || 0,
            score: score || 0,
            attempts: attempts || 0,
            time_taken: time_taken || 0,
            completedAt: completedAt || null,
            rewardType: rewardType || null,
            awardedAt: awardedAt || new Date(),
        });

        await newGameProgress.save();

        return NextResponse.json(
            {
                success: true,
                message: "Game progress created successfully.",
                data: newGameProgress,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating or update game progress:", error);
        return NextResponse.json(
            { error: "Failed to create or update the game progress" },
            { status: 500 }
        );
    }
}
