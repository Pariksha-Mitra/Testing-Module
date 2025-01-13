import { Chapter } from '@/models/questionsSchema';
import { connectDb } from '@/utils/db';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * paths:
 *   /api/chapters/{chapterId}:
 *     get:
 *       tags:
 *         - Chapters
 *       summary: "Get a single chapter by ID"
 *       description: "Retrieve a single chapter from the database by its ID."
 *       parameters:
 *         - name: "chapterId"
 *           in: "path"
 *           required: true
 *           description: "The ID of the chapter to retrieve."
 *           schema:
 *             type: "string"
 *       responses:
 *         200:
 *           description: "Successfully retrieved the chapter."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   singleChapter:
 *                     $ref: "#/components/schemas/Chapter"
 *         404:
 *           description: "Chapter not found."
 *         500:
 *           description: "Failed to retrieve the chapter due to a server error."
 */

// Define type for context params
interface ChapterContext {
  params: {
    chapterId: string; // Match URL parameter case
  };
}

export async function GET(request: Request, context: ChapterContext) {
  try {
    await connectDb();

    const { chapterId } = context.params; // Match URL parameter case

    if (!chapterId) {
      return NextResponse.json(
        { success: false, error: "Chapter ID is required" },
        { status: 400 }
      );
    }

    const singleChapter = await Chapter.findById(chapterId).populate(
      "fk_subject_id"
    ); // Add population if needed

    if (!singleChapter) {
      return NextResponse.json(
        { success: false, error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, chapter: singleChapter },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving chapter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve chapter" },
      { status: 500 }
    );
  }
}
