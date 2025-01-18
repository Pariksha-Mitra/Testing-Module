import { NextRequest, NextResponse } from "next/server";
import { Question } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";

/**
 * @swagger
 * /api/exercises/get-question:
 *   post:
 *     summary: Fetch questions related to a specific exercise
 *     description: Retrieve a list of questions associated with a given exercise ID from the database.
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exerciseId:
 *                 type: string
 *                 description: The ID of the exercise to fetch questions for.
 *                 example: "64d12345b7e89d1234567890"
 *     responses:
 *       200:
 *         description: Successfully retrieved questions for the specified exercise.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exercise_related_questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the question.
 *                         example: "64f12345c7e89d1234567890"
 *                       question_text:
 *                         type: string
 *                         description: The text of the question.
 *                         example: "What is the capital of France?"
 *                       fk_exercise_id:
 *                         type: string
 *                         description: The foreign key exercise ID associated with the question.
 *                         example: "64d12345b7e89d1234567890"
 *       400:
 *         description: Bad Request. Missing or invalid exerciseId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Exercise Id is required"
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
        const {exerciseId} = await req.json();
        if(!exerciseId){
            return NextResponse.json({error: "Exercise Id is required"}, {status: 400})
        }
        const exercise_related_questions = await Question.find({fk_exercise_id: exerciseId});
        return NextResponse.json({exercise_related_questions}, {status: 200});

    } catch (error) {
        console.error("Error in get-question", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
    
}