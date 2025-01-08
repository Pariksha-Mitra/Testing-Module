import { NextResponse } from "next/server";
import {Standard} from "@/models/questionsSchema";
import {connectDB} from "@/utils/db"
import { Chapter } from "@/models/questionsSchema";
import { Exercise } from "@/models/questionsSchema";
import { Question } from "@/models/questionsSchema";
/**
 * @swagger
 * paths:
 *   /api/classes:
 *     get:
 *       tags:
 *         - Classes
 *       summary: "Get all classes (standards)"
 *       description: "Retrieve all the available standards (classes)."
 *       responses:
 *         200:
 *           description: "Successfully retrieved all classes."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   classes:
 *                     type: "array"
 *                     items:
 *                       $ref: "#/components/schemas/Standard"
 *         400:
 *           description: "Failed to retrieve classes."
 */

/**
 * @swagger
 * paths:
 *   /api/classes:
 *     post:
 *       tags:
 *         - Classes
 *       summary: "Create a new class (standard)"
 *       description: "Create a new class (standard) by providing its name and description."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 standardName:
 *                   type: "string"
 *                   description: "Name of the standard (class)."
 *                 description:
 *                   type: "string"
 *                   description: "Description of the standard (class)."
 *       responses:
 *         201:
 *           description: "Successfully created a new standard."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   message:
 *                     type: "string"
 *                   standard:
 *                     $ref: "#/components/schemas/Standard"
 *         400:
 *           description: "Standard name is required."
 *         500:
 *           description: "Failed to create the standard."
 */

/**
 * @swagger
 * paths:
 *   /api/classes:
 *     delete:
 *       tags:
 *         - Classes
 *       summary: "Delete a class (standard) and its related data"
 *       description: "Delete a class (standard) by providing its ID along with its related chapters, exercises, and questions."
 *       parameters:
 *         - name: "id"
 *           in: "query"
 *           required: true
 *           description: "The ID of the standard (class) to delete."
 *           schema:
 *             type: "string"
 *       responses:
 *         200:
 *           description: "Successfully deleted the standard and related data."
 *         404:
 *           description: "Standard or related data not found."
 *         500:
 *           description: "Failed to delete standard and related data."
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
 */


export async function GET() {
    try {
        await connectDB();
        const classes = await Standard.find();
        return NextResponse.json({classes}, {status:200}) 
    } catch (error) {
        return NextResponse.json({error:"Failed to retrive the Classes Information"},{status: 400});
    }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const { standardName, description } = await req.json();

    if (!standardName) {
      return NextResponse.json({ error: "Standard name is required" },{ status: 400 });
    }
    const newStandard = new Standard({standardName,description,});
    const savedStandard = await newStandard.save();

    return NextResponse.json({message: "Standard created successfully", standard: savedStandard },{status: 201 });
  } catch (error) {
    console.log("Error creating standard:", error);
    return NextResponse.json({error: "Failed to create standard" },{status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    const {searchParams} = new URL(req.url);
    const standardId = searchParams.get("id");
    
    if (!standardId) {
      return NextResponse.json({ error: "Id not Found" }, { status: 404 });
    }


    const chaptersToDelete = await Chapter.find({ standard: standardId });
    const chapterIds = chaptersToDelete.map(chapter => chapter._id);

    const exercisesToDelete = await Exercise.find({ chapter: { $in: chapterIds } });
    const exerciseIds = exercisesToDelete.map(exercise => exercise._id);

    await Question.deleteMany({ exercise: { $in: exerciseIds } });

    await Exercise.deleteMany({ _id: { $in: exerciseIds } });

    await Chapter.deleteMany({ _id: { $in: chapterIds } });

    const deletedStandard = await Standard.findByIdAndDelete(standardId);

    if (!deletedStandard) {
      return NextResponse.json({ error: "Standard not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Standard and related data deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting standard and related data:", error);
    return NextResponse.json({ error: "Failed to delete standard and related data" }, { status: 500 });
  }
}

