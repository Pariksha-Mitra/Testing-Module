import SchoolModel from "@/models/schoolModel";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/school/delete:
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
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
      }
  
      const deletedSchool = await SchoolModel.findByIdAndDelete(id);
  
      if (!deletedSchool) {
        return NextResponse.json(
          { message: "School not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        message: "School Deleted",
        success: true,
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
  