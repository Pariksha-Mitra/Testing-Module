import { TestModel } from "@/models/testModel";
import { handleApiError } from "@/utils/api-error";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/get-tests/{testId}:
 *   get:
 *     tags:
 *       - Tests
 *     summary: Get a test by ID
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: The test ID
 *     responses:
 *       201:
 *         description: Successful fetch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 test:
 *                   type: object
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  await connectDb();

  try {
    const testId = await params.testId;
    const test = await TestModel.findById(testId);

    return NextResponse.json(
      {
        message: "Successfull fetch",
        test,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return handleApiError(error instanceof Error ? error.message : error);
  }
}
