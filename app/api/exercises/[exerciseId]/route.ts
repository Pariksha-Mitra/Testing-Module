import { connectDb } from '@/utils/db';
import { Exercise } from '@/models/questionsSchema';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * paths:
 *   /api/exercises/{exerciseId}:
 *     get:
 *       tags:
 *         - Exercises
 *       summary: "Get a single exercise by its ID"
 *       description: "Retrieve an exercise by its ID along with related details such as chapter and questions."
 *       parameters:
 *         - name: "exerciseId"
 *           in: "path"
 *           required: true
 *           description: "The ID of the exercise to retrieve."
 *           schema:
 *             type: "string"
 *       responses:
 *         200:
 *           description: "Successfully retrieved the exercise."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   singleExercise:
 *                     $ref: "#/components/schemas/Exercise"
 *         404:
 *           description: "Exercise not found."
 *         500:
 *           description: "Failed to retrieve the exercise."
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: "object"
 *       properties:
 *         _id:
 *           type: "string"
 *         title:
 *           type: "string"
 *         description:
 *           type: "string"
 *         chapter:
 *           type: "string"
 */

// Define interface for context
interface ExerciseContext {
  params: {
    exerciseId: string;
  };
}

export async function GET(req: Request, context: ExerciseContext) {
  try {
    await connectDb();

    const { exerciseId } = context.params;

    if (!exerciseId) {
      return NextResponse.json(
        { success: false, error: "Exercise ID is required" },
        { status: 400 }
      );
    }

    const singleExercise = await Exercise.findById(exerciseId).populate(
      "fk_chapter_id"
    ); // Add population if needed

    if (!singleExercise) {
      return NextResponse.json(
        { success: false, error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, singleExercise },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving single exercise:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve the single exercise" },
      { status: 500 }
    );
  }
}
