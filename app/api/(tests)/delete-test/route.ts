import { TestModel } from "@/models/testModel";
import { handleApiError } from "@/utils/api-error";
import { connectDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/delete-test:
 *   delete:
 *     tags:
 *       - Tests
 *     summary: Delete a test by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The test ID
 *     responses:
 *       200:
 *         description: Test deleted successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Server error
 */

export async function DELETE(req: NextRequest) {
  await connectDb();

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    const test = await TestModel.findById(id);
    if (!test) throw new Error("Test not found!, check your ID");

    await TestModel.findByIdAndDelete(id);

    return (
      NextResponse.json({ message: "Test deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError(error instanceof Error ? error.message : error);
  }
}
