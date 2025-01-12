import { NextResponse } from "next/server";
import { Subject } from "@/models/questionsSchema"; // Replace with your Subject model
import { connectDb } from "@/utils/db";

/**
 * @swagger
 * paths:
 *   /api/subject/{subjectId}:
 *     get:
 *       tags:
 *         - Subjects
 *       summary: "Get a single subject by ID"
 *       description: "Retrieve a single subject from the database by its ID."
 *       parameters:
 *         - name: "subjectId"
 *           in: "path"
 *           required: true
 *           description: "The ID of the subject to retrieve."
 *           schema:
 *             type: "string"
 *       responses:
 *         200:
 *           description: "Successfully retrieved the subject."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   singleSubject:
 *                     $ref: "#/components/schemas/Subject"
 *         404:
 *           description: "Subject not found."
 *         500:
 *           description: "Failed to retrieve the subject due to a server error."
 */

export async function GET(req: Request, { params }: { params: { subjectId: string } }) {
  try {
    await connectDb();
    const Params = await params;
    
    if (!Params || !Params.subjectId) {
        return NextResponse.json({ error: "Invalid SubjectId" }, { status: 400 });
    }
    
    const { subjectId } = Params;
    console.log("idddd = ",subjectId)
    const singleSubject = await Subject.findById({_id: subjectId});

    if (!singleSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ singleSubject }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single subject:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single subject" },
      { status: 500 }
    );
  }
}
