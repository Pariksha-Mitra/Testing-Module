import { NextRequest, NextResponse } from "next/server";
import { Exercise } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";

/**
 * @swagger
 * /api/exercises/get-exercise:
 *   post:
 *     summary: Fetch exercises related to a specific chapter
 *     description: Retrieve a list of exercises associated with a given chapter ID from the database.
 *     tags:
 *       - Exercises
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 description: The ID of the chapter to fetch exercises for.
 *                 example: "64b12345c7e89d1234567890"
 *     responses:
 *       200:
 *         description: Successfully retrieved exercises for the specified chapter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapter_related_exercise:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the exercise.
 *                         example: "64e12345c7e89d1234567890"
 *                       title:
 *                         type: string
 *                         description: Title of the exercise.
 *                         example: "Sample Exercise Title"
 *                       fk_chapter_id:
 *                         type: string
 *                         description: The foreign key chapter ID associated with the exercise.
 *                         example: "64b12345c7e89d1234567890"
 *       400:
 *         description: Bad Request. Missing or invalid chapterId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Chapter Id is required"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal Server Error"
 */


export async function POST(req:NextRequest) {
    try {
        await connectDb();
        const {chapterId} = await req.json();
        if(!chapterId){
            return NextResponse.json({error: "Chapter Id is required"}, {status: 400});
        }
        const chapter_related_exercise = await Exercise.find({fk_chapter_id: chapterId});
        return NextResponse.json({chapter_related_exercise},{status: 200});

    } catch (error) {
        console.error("Error in get exericse:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}