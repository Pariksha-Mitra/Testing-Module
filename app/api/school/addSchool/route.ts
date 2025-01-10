import SchoolModel from "@/models/schoolModel";
import { schoolSchema } from "@/models/schoolSchema";
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
      await SchoolModel.syncIndexes()
      
      const body = await req.json();
  
      if (!body) {
        return NextResponse.json(
          { message: "Request body is required" },
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
  
      const school = await SchoolModel.create({
        name: validation.data.name,
        contact: validation.data.contact,
        address: validation.data.address,
      });
  
      await school.save();
  
      return NextResponse.json({
        message: "School Added",
        success: true,
        id: school.id,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: error instanceof Error ? error.message : "Internal Server Error",
          success: false,
        },
        { status: 500 }
      );
    }
  }