import SchoolModel from '@/models/schoolSchema';
import { connectDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/school/listSchool:
 *   get:
 *     tags: [School]
 *     summary: Get all schools or a specific school by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID of the school to retrieve
 *     responses:
 *       200:
 *         description: List of all schools or the specified school
 *       404:
 *         description: School not found
 *       500:
 *         description: Internal server error
 */

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      const schools = await SchoolModel.find();
      return NextResponse.json(
        {
          success: true,
          message: "All schools retrieved",
          schools,
        },
        { status: 200 }
      ); // Use 200 for successful GET
    }

    const school = await SchoolModel.findById(id);

    if (!school) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "School found",
        school,
      },
      { status: 200 }
    ); // Use 200 instead of 201 for GET
  } catch (error) {
    console.error("Error retrieving schools:", error);
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
