import { connectDb } from '@/utils/db';
import { Exercise, Question } from '@/models/questionsSchema';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * paths:
 *   /api/exercises:
 *     get:
 *       tags:
 *         - Exercises
 *       summary: "Get all exercises"
 *       description: "Retrieve a list of all exercises from the database."
 *       responses:
 *         200:
 *           description: "Successfully retrieved the list of exercises."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   exercises:
 *                     type: "array"
 *                     items:
 *                       $ref: "#/components/schemas/Exercise"
 *         400:
 *           description: "Failed to retrieve exercises."
 *     post:
 *       tags:
 *         - Exercises
 *       summary: "Create a new exercise"
 *       description: "Create a new exercise and associate it with a chapter."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 title:
 *                   type: "string"
 *                 description:
 *                   type: "string"
 *                 chapterId:
 *                   type: "string"
 *       responses:
 *         201:
 *           description: "Successfully created the exercise."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   message:
 *                     type: "string"
 *                   exercise:
 *                     $ref: "#/components/schemas/Exercise"
 *         400:
 *           description: "Title, description, and chapterId are required."
 *         500:
 *           description: "Failed to create the exercise."
 *     delete:
 *       tags:
 *         - Exercises
 *       summary: "Delete an exercise by ID"
 *       description: "Delete a specific exercise by its ID and all related questions."
 *       parameters:
 *         - name: "id"
 *           in: "query"
 *           required: true
 *           description: "The ID of the exercise to delete."
 *           schema:
 *             type: "string"
 *       responses:
 *         200:
 *           description: "Successfully deleted the exercise and its related questions."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   message:
 *                     type: "string"
 *                   deletedExercise:
 *                     $ref: "#/components/schemas/Exercise"
 *         400:
 *           description: "Exercise ID is required."
 *         404:
 *           description: "Exercise not found."
 *         500:
 *           description: "Failed to delete the exercise and related questions."
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

export async function GET() {
  try {
    await connectDb();
    const exercises = await Exercise.find().populate("fk_chapter_id");
    return NextResponse.json({ success: true, exercises }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving exercises:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve exercises" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();

    const { title, description, chapterId } = await req.json();

    if (!title || !description || !chapterId) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, description, and chapterId are required",
        },
        { status: 400 }
      );
    }

    const newExercise = new Exercise({
      title,
      description,
      fk_chapter_id: chapterId,
    });

    const savedExercise = await newExercise.save();
    return NextResponse.json(
      { success: true, exercise: savedExercise },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Failed to create the exercise" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDb();

    // Extract exercise ID from the query parameters
    const { searchParams } = new URL(req.url);
    const exerciseId = searchParams.get("id");

    if (!exerciseId) {
      return NextResponse.json(
        { error: "Exercise ID is required" },
        { status: 400 }
      );
    }

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    await Question.deleteMany({ exercise: exerciseId });

    const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);

    return NextResponse.json(
      {
        message: "Exercise and related questions deleted successfully",
        deletedExercise,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting exercise and related questions:", error);
    return NextResponse.json(
      { error: "Failed to delete the exercise and related questions" },
      { status: 500 }
    );
  }
}
