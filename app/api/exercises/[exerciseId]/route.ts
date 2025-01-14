<<<<<<< HEAD
import { NextResponse } from "next/server";
import { Exercise } from "@/models/questionsSchema";
import {connectDb} from "@/utils/db";
=======
import { connectDb } from '@/utils/db';
import { Exercise } from '@/models/questionsSchema';
import { NextResponse } from 'next/server';
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e

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

<<<<<<< HEAD

export async function GET(req: Request, context: { params: { exerciseId: string } }) {
  try {
    await connectDb();
    const { exerciseId } = context.params;
    const singleExercise = await Exercise.findById(exerciseId);

    if (!singleExercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
=======
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
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
        { status: 404 }
      );
    }

<<<<<<< HEAD
    return NextResponse.json({ singleExercise }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single exercise:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single exercise" },
      { status: 500 }
    );
  }
}
=======
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
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
