import { NextResponse } from "next/server";
import { Standard } from "@/models/questionsSchema";
import {connectDB} from "@/utils/db";

/**
 * @swagger
 * paths:
 *   /api/standards/{standardId}:
 *     get:
 *       tags:
 *         - Standards
 *       summary: "Get a standard and its related chapters, exercises, and questions"
 *       description: "Retrieve a standard by its ID along with its associated chapters, exercises, and questions."
 *       parameters:
 *         - name: "standardId"
 *           in: "path"
 *           required: true
 *           description: "The ID of the standard to retrieve."
 *           schema:
 *             type: "string"
 *       responses:
 *         200:
 *           description: "Successfully retrieved the standard with its related data."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   success:
 *                     type: "boolean"
 *                   standard:
 *                     $ref: "#/components/schemas/Standard"
 *         400:
 *           description: "StandardId is required."
 *         404:
 *           description: "Standard not found."
 *         500:
 *           description: "Failed to fetch the standard data."
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Standard:
 *       type: "object"
 *       properties:
 *         _id:
 *           type: "string"
 *         standardName:
 *           type: "string"
 *         description:
 *           type: "string"
 *         chapters:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Chapter"
 *
 *     Chapter:
 *       type: "object"
 *       properties:
 *         _id:
 *           type: "string"
 *         title:
 *           type: "string"
 *         exercises:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Exercise"
 *
 *     Exercise:
 *       type: "object"
 *       properties:
 *         _id:
 *           type: "string"
 *         title:
 *           type: "string"
 *         questions:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Question"
 *
 *     Question:
 *       type: "object"
 *       properties:
 *         _id:
 *           type: "string"
 *         questionText:
 *           type: "string"
 *         answer:
 *           type: "string"
 */

export async function GET(req: Request, context: any) {
  try {
    await connectDB();

    const {standardId} = await context.params;
    if (!standardId) {
        return NextResponse.json(
          { success: false, error: "StandardId is required" },
          { status: 400 }
        );
      }

    const standard = await Standard.findById(standardId)
      .populate({
        path: "chapters",
        populate: {
          path: "exercises", 
          populate: {
            path: "questions", 
          },
        },
      })
      .exec();

    if (!standard) {
      return NextResponse.json(
        { success: false, error: "Standard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, standard }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch standard data" },
      { status: 500 }
    );
  }
}
