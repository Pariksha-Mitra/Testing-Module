import SchoolModel, { schoolSchemaZod } from "@/models/schoolSchema";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface UpdateSchoolRequest {
  id: string;
  name: string;
  contact: string;
  address: string;
}

/**
 * @swagger
 * /api/school/updateSchool:
 *   put:
 *     tags: [School]
 *     summary: Update a school's details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: School updated successfully
 *       400:
 *         description: Request body or ID missing
 *       404:
 *         description: School not found
 *       500:
 *         description: Internal server error
 */

export async function PUT(req: NextRequest) {
  try {
    await connectDb();

    const body = (await req.json()) as UpdateSchoolRequest;

    if (!body?.id) {
      return NextResponse.json(
        { success: false, message: "Request body and ID are required" },
        { status: 400 }
      );
    }

    const validation = schoolSchemaZod.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.message },
        { status: 400 }
      );
    }

    const updatedSchool = await SchoolModel.findByIdAndUpdate(
      body.id,
      validation.data,
      { new: true }
    );

    if (!updatedSchool) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "School Updated",
      success: true,
      school: updatedSchool,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
          error: {},
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Unknown error occurred",
        error: error,
      },
      { status: 500 }
    );
  }
}
