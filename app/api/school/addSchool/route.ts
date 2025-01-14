import SchoolModel, { schoolSchemaZod } from "@/models/schoolSchema";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/school/addSchool:
 *   post:
 *     tags: [School]
 *     summary: Register a new school
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: School added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    await SchoolModel.syncIndexes();

    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Request body is required" },
        { status: 400 }
      );
    }

    const validation = schoolSchemaZod.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.message },
        { status: 400 } // Change to 400 for validation errors
      );
    }

    const school = await SchoolModel.create({
      name: validation.data.name,
      contact: validation.data.contact,
      address: validation.data.address,
    });

    return NextResponse.json(
      {
        message: "School Added",
        success: true,
        id: school.id,
      },
      { status: 201 }
    ); // Use 201 for resource creation
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
