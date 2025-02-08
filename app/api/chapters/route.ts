import {
    Chapter,
    Exercise,
    Question,
    Subject
    } from '@/models/questionsSchema';
import { connectDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

// Add type for create chapter request
interface CreateChapterRequest {
  title: string;
  description?: string;
  subjectId: string;
}

/**
 * @swagger
 * /api/chapters:
 *   get:
 *     summary: Get all chapters
 *     description: Fetches a list of all chapters from the database.
 *     tags:
 *       - Chapters
 *     responses:
 *       200:
 *         description: Successfully retrieved chapters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chapter'
 *       400:
 *         description: Failed to retrieve chapter information.
 */
export async function GET() {
  try {
    await connectDb();

    const chapters = await Chapter.find();
    return NextResponse.json({ chapters }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve the chapter information" },
      { status: 400 }
    );
  }
}

/**
 * @swagger
 * /api/chapters:
 *   post:
 *     summary: Create a new chapter
 *     description: Creates a new chapter in the database associated with a specific subject.
 *     tags:
 *        - Chapters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - subjectId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               subjectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chapter created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 chapter:
 *                   $ref: '#/components/schemas/Chapter'
 *       400:
 *         description: Missing title or subject ID.
 *       404:
 *         description: Standard ID not found.
 *       500:
 *         description: Failed to create chapter.
 */
export async function POST(req: Request) {
  try {
    await connectDb();

    // Parse the request body
    const { title, description, subjectId } =
      (await req.json()) as CreateChapterRequest;

    // Validate required fields
    if (!title || !subjectId) {
      return NextResponse.json(
        { success: false, error: "Title and Subject ID are required" },
        { status: 400 }
      );
    }

    // Check if the provided subject exists
    const subjectIdExists = await Subject.findById(subjectId);
    if (!subjectIdExists) {
      return NextResponse.json(
        { error: "The provided Subject ID does not exist" },
        { status: 404 }
      );
    }

    // Create a new Chapter document
    const newChapter = new Chapter({
      title,
      description,
      fk_subject_id: subjectId,
    });

    // Save the Chapter to the database
    const savedChapter = await newChapter.save();

    // Return a success response
    return NextResponse.json(
      {
        message: "Chapter created successfully",
        chapter: {
          _id: savedChapter._id,
          title: savedChapter.title,
          description: savedChapter.description,
          fk_subject_id: savedChapter.fk_subject_id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Failed to create chapter" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/chapters:
 *   delete:
 *     summary: Delete a chapter by ID
 *     description: Deletes a chapter along with related exercises and questions from the database.
 *     tags:
 *       - Chapters
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chapter to be deleted.
 *     responses:
 *       200:
 *         description: Chapter and related data deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 chapterId:
 *                   type: string
 *                 deletedExercises:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Missing chapter ID.
 *       404:
 *         description: Chapter not found.
 *       500:
 *         description: Failed to delete chapter and related data.
 */
export async function DELETE(req: Request) {
  try {
    await connectDb();

    // Extract chapter ID from query parameters
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("id");

    if (!chapterId) {
      return NextResponse.json(
        { error: "Chapter ID is required" },
        { status: 400 }
      );
    }

    // Check if the chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Find and delete related exercises
    const exercisesToDelete = await Exercise.find({ chapter: chapterId });
    const exerciseIds = exercisesToDelete.map((exercise) => exercise._id);

    // Find and delete related questions for the exercises
    await Question.deleteMany({ exercise: { $in: exerciseIds } });

    // Delete the exercises
    await Exercise.deleteMany({ _id: { $in: exerciseIds } });

    // Finally, delete the chapter
    await Chapter.findByIdAndDelete(chapterId);

    return NextResponse.json(
      {
        message: "Chapter and related data deleted successfully",
        chapterId,
        deletedExercises: exerciseIds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting chapter and related data:", error);
    return NextResponse.json(
      { error: "Failed to delete chapter and related data" },
      { status: 500 }
    );
  }
}


export async function PUT(req:NextRequest) {
  try {
    await connectDb();

    const {chapterId, title, description, subjectId} = await req.json();

    if(!chapterId || !title || !subjectId){
      return NextResponse.json(
        {error: "Id, title subjectId are required "},
        {status: 400}
      );
    }

    const existingChapter = await Chapter.findOne({_id: chapterId});
    if(!existingChapter){
      return NextResponse.json(
        {error: "No existing record found for chapter"},
        {status: 404}
      )
    }

    if(title)existingChapter.title = title;
    if(description)existingChapter.description = description;
    if(subjectId)existingChapter.fk_subject_id = subjectId;

    await existingChapter.save();

    return NextResponse.json(
      {success: "Chapter upated successfully", chapter: existingChapter },
      {status: 200}
    )

  } catch (error) {
    console.log("Error updating chapter", error)
    return NextResponse.json(
      {error: "Something went wrong in updating chapter"},
      {status: 500}
    )
  }
  
}
