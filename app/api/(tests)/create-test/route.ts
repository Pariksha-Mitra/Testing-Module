import { handleApiError } from "@/utils/api-error";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { TestSchema } from "@/models/testSchema";
import { TestModel } from "@/models/testModel";

/**
 * @swagger
 * paths:
 *   /api/create-test:
 *     post:
 *       tags:
 *         - Tests
 *       summary: Create a new test
 *       description: Creates a new test with the provided details
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - test_title
 *                 - created_by
 *                 - marks
 *                 - questions
 *                 - valid_upto
 *               properties:
 *                 test_title:
 *                   type: string
 *                 created_by:
 *                   type: string
 *                 marks:
 *                   type: number
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 valid_upto:
 *                   type: string
 *                   format: date-time
 *       responses:
 *         201:
 *           description: Test created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         500:
 *           description: Internal server error
 */

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const body = await req.json();

    const isValid = TestSchema.safeParse(body);

    if (!isValid.success) {
      throw new Error(
        isValid.error instanceof Error ? isValid.error.message : isValid.error
      );
    }
    const { test_title, created_by, marks, questions, valid_upto } =
      isValid.data;

    const test = await TestModel.create({
      test_title,
      created_by,
      marks,
      questions,
      valid_upto,
    });

    await test.save();

    return NextResponse.json(
      {
        message: "Test created succesfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error instanceof Error ? error.message : error);
  }
}
