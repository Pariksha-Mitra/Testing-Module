import { TestModel } from "@/models/testModel";
import { handleApiError } from "@/utils/api-error";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * paths:
 *  /api/get-tests:
 *    get:
 *      tags:
 *        - Tests
 *      description: Returns all tests
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  tests:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Test'
 *                  message:
 *                    type: string
 *        500:
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 */

export async function GET() {
  await connectDb();

  try {
    const tests = await TestModel.find();

    return NextResponse.json({
      tests,
      message: "Successfull fetch",
    });
  } catch (error) {
    return handleApiError(error instanceof Error ? error.message : error);
  }
}
