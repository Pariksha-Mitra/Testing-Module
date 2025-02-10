import { TestModel } from "@/models/testModel";
import { TestSchemaType } from "@/models/testSchema";
import { handleApiError } from "@/utils/api-error";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/update-test:
 *   put:
 *     tags:
 *       - Tests
 *     summary: Update a test by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestSchemaType'
 *             description: Test update data
 *     responses:
 *       200:
 *         description: Test updated successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Server error
 */

export async function PUT(req: NextRequest) {
  await connectDb();

  try {
    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get("id");

    const test = await TestModel.findById(id);

    if (!test) throw new Error("Test not found!, check your ID");

    const updateBody: Partial<TestSchemaType> = await req.json();

    await TestModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateBody,
      }
    );

    return NextResponse.json(
      {
        message: "Test updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error instanceof Error ? error.message : error);
  }
}
