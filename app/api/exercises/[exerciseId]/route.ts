import { NextResponse } from "next/server";
import { Exercise } from "@/models/questionsSchema";
import {connectDB} from "@/utils/db";

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


export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const { ChapterId } = await context.params;
    const singleExercise = await Exercise.findById(ChapterId);

    if (!singleExercise) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ singleExercise }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single exercise:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single chapter exercise" },
      { status: 500 }
    );
  }
}
