import { NextResponse } from "next/server";
import { Chapter } from "@/models/questionsSchema";
import {connectDb} from "@/utils/db";

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

export async function GET(req: Request, context: { params: { ChapterId: string } }) {
  try {
    await connectDb();
    const { ChapterId } = context.params;
    const singleChapter = await Chapter.findById(ChapterId);

    if (!singleChapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ singleChapter }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single chapter:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single chapter" },
      { status: 500 }
    );
  }
}

