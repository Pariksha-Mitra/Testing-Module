import SchoolModel from '@/models/schoolSchema';
import { connectDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/school/deleteSchool:
 *   delete:
 *     tags: [School]
 *     summary: Delete a school by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       400:
 *         description: ID is required
 *       404:
 *         description: School not found
 *       500:
 *         description: Internal server error
 */

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const deletedSchool = await SchoolModel.findByIdAndDelete(id);

    if (!deletedSchool) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "School deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting school:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
