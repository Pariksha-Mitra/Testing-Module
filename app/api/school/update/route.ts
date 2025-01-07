import SchoolModel from "@/models/schoolModel";
import { schoolSchema } from "@/models/schoolSchema";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/school/update:
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
  
      const body = await req.json();
  
      if (!body || !body.id) {
        return NextResponse.json(
          { message: "Request body and ID are required" },
          { status: 400 }
        );
      }
  
      const validation = schoolSchema.safeParse(body);
  
      if (!validation.success) {
        return NextResponse.json(
          { message: validation.error.message },
          { status: 500 }
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