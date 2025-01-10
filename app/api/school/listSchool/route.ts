import SchoolModel from "@/models/schoolModel";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

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
    await connectDb();
  
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (!id) {
        const schools = await SchoolModel.find();
        return NextResponse.json({
          message: "All schools",
          schools,
        });
      }
  
      const school = await SchoolModel.findById(id);
  
      if (!school) {
        return NextResponse.json(
          { message: "School not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        message: "School found",
        school,
      }, {
        status : 201
      });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          {
            message: error.message,
            error,
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