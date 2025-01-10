import { NextResponse } from "next/server";
import { Standard } from "@/models/questionsSchema";
import {connectDb} from "@/utils/db";

/**
 * @swagger
 * /api/standard/{standardId}:
 *   get:
 *     summary: Fetch a standard by ID
 *     description: Retrieves a single standard's details, including its name and description, based on the provided `standardId`.
 *     tags:
 *       - Standards
 *     parameters:
 *       - in: path
 *         name: standardId
 *         required: true
 *         description: The ID of the standard to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the standard details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 standard:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6772a873bc41879fdd60748d"
 *                     standardName:
 *                       type: integer
 *                       example: 10
 *                     description:
 *                       type: string
 *                       example: "This is the standard for students in grade 10."
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Missing or invalid standardId parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "StandardId is required"
 *       404:
 *         description: Standard not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Standard not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch standard data"
 */


export async function GET(req: Request, context: any) {
  try {
    await connectDb();
    const {standardId} = await context.params;
    if (!standardId) {
        return NextResponse.json(
          { success: false, error: "StandardId is required" },
          { status: 400 }
        );
      }

    const standard = await Standard.findById(standardId)

    if (!standard) {
      return NextResponse.json(
        { success: false, error: "Standard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, standard }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch standard data"},
      { status: 500 }
    );
  }
}
