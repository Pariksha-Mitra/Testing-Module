import { connectDb } from "@/utils/db";
import { Game } from "@/models/gameSchema";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/games:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get all games
 *     description: Fetches all games from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved games.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Games'
 *       500:
 *         description: Failed to fetch games
 */
export async function GET() {
    try {
        await connectDb();
        const games = await Game.find();
        return NextResponse.json({ success: true, games }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving games:", error);
        return NextResponse.json(
            { success: false, error: "Failed to retrieve games" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Create a new game
 *     description: Creates a new game with the provided details.
 *     tags:
 *       - Games
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the game.
 *               standard:
 *                 type: number
 *                 description: The standard or grade level of the game.
 *               subject:
 *                 type: string
 *                 description: The subject of the game.
 *               chapter:
 *                 type: string
 *                 description: The chapter associated with the game.
 *               exercise:
 *                 type: number
 *                 description: The exercise number for the game.
 *               description:
 *                 type: string
 *                 description: A brief description of the game.
 *                 example: A fun way to practice algebra.
 *               difficulty:
 *                 type: string
 *                 description: The difficulty level of the game.
 *                 enum:
 *                   - EASY
 *                   - MEDIUM
 *                   - HARD
 *               timeLimit:
 *                 type: number
 *                 description: Time limit in seconds for completing the game.
 *               status:
 *                 type: string
 *                 description: Current status of the game.
 *                 enum:
 *                   - ACTIVE
 *                   - INACTIVE
 *                   - ARCHIVED
 *               numberLevels:
 *                 type: number
 *                 description: Total number of levels in the game.
 *     responses:
 *       201:
 *         description: Game created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Game created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique ID of the created game.
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
 *       400:
 *         description: Validation error or missing required fields.
 *       500:
 *         description: Server error.
 */

export async function POST(req: Request) {
    try {
        await connectDb();

        const {
            title,
            standard,
            subject,
            chapter,
            exercise,
            description,
            difficulty,
            timeLimit,
            status,
            numberLevels,
        } = await req.json();

        if (
            !title ||
            !standard ||
            !subject ||
            !chapter ||
            !exercise ||
            !timeLimit ||
            !numberLevels
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Title, Standard, Subject, Chapter, Exercise, TimeLimit, and NumberLevels are required fields",
                },
                { status: 400 }
            );
        }

        const newGame = new Game({
            title,
            standard,
            subject,
            chapter,
            exercise,
            description,
            difficulty,
            timeLimit,
            status,
            numberLevels,
        });

        const savedGame = await newGame.save();
        return NextResponse.json(
            { success: true, game: savedGame },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating game:", error);
        return NextResponse.json(
            { error: "Failed to create the game" },
            { status: 500 }
        );
    }
}
