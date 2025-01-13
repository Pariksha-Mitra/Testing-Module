import { connectDb } from '@/utils/db';
import { NextResponse } from 'next/server';
import { Standard, Subject } from '@/models/questionsSchema';

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     description: Fetches a list of all subjects from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved subjects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 subjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subject'
 *       500:
 *         description: Failed to retrieve subject information.
 */
export async function GET() {
  try {
    await connectDb();
    const subjects = await Subject.find();

    return NextResponse.json(
      {
        success: true,
        subjects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving subjects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve the subject information",
      },
      { status: 500 }
    ); // Change to 500 for server errors
  }
}

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Create a new subject
 *     description: Creates a new subject in the database associated with a specific standard.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subjectName
 *               - standardId
 *             properties:
 *               subjectName:
 *                 type: string
 *               description:
 *                 type: string
 *               standardId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 subject:
 *                   $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Missing subject name or standard ID.
 *       404:
 *         description: Standard ID not found.
 *       500:
 *         description: Failed to create subject.
 */
export async function POST(req: Request) {
  try {
    await connectDb();

    // Parse the request body
    const { subjectName, description, standardId } = await req.json();

    // Validate required fields
    if (!subjectName || !standardId) {
      return NextResponse.json(
        { error: "Subject name and Standard ID are required" },
        { status: 400 }
      );
    }

    // Check if the provided Standard exists
    const standardExists = await Standard.findById(standardId);
    if (!standardExists) {
      return NextResponse.json(
        { error: "The provided Standard ID does not exist" },
        { status: 404 }
      );
    }

    // Create a new Subject document
    const newSubject = new Subject({
      subjectName,
      description,
      fk_standard_id: standardId,
    });

    // Save the Subject to the database
    const savedSubject = await newSubject.save();

    // Return a success response
    return NextResponse.json(
      {
        message: "Subject created successfully",
        subject: {
          _id: savedSubject._id,
          subjectName: savedSubject.subjectName,
          description: savedSubject.description,
          fk_standard_id: savedSubject.fk_standard_id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/subjects:
 *   delete:
 *     summary: Delete a subject by ID
 *     description: Deletes a subject from the database.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to be deleted.
 *     responses:
 *       200:
 *         description: Subject deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 subjectId:
 *                   type: string
 *       400:
 *         description: Missing subject ID.
 *       404:
 *         description: Subject not found.
 *       500:
 *         description: Failed to delete subject.
 */
export async function DELETE(req: Request) {
  try {
    await connectDb();

    // Extract subject ID from query parameters
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("id");

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Delete the subject
    await Subject.findByIdAndDelete(subjectId);

    return NextResponse.json(
      {
        message: "Subject deleted successfully",
        subjectId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 }
    );
  }
}
