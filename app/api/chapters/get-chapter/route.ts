import { NextRequest, NextResponse } from "next/server";
import { Chapter } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";

/**
 * @swagger
 * /api/chapters/get-chapter:
 *   post:
 *     summary: Fetch chapters related to a specific subject
 *     description: Retrieve a list of chapters associated with a given subject ID from the database.
 *     tags:
 *       - Chapters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjectId:
 *                 type: string
 *                 description: The ID of the subject to fetch chapters for.
 *                 example: "64c12345a7e89d1234567890"
 *     responses:
 *       200:
 *         description: Successfully retrieved chapters for the specified subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject_related_chapters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the chapter.
 *                         example: "64e12345c7e89d1234567890"
 *                       title:
 *                         type: string
 *                         description: Title of the chapter.
 *                         example: "Introduction to Chemistry"
 *                       fk_subject_id:
 *                         type: string
 *                         description: The foreign key subject ID associated with the chapter.
 *                         example: "64c12345a7e89d1234567890"
 *       400:
 *         description: Bad Request. Missing or invalid subjectId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "subject Id is required"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal Server Error"
 */



export async function POST(req:NextRequest) {
    try {
        await connectDb();
        const {subjectId} = await req.json();
        if(!subjectId){
            return NextResponse.json({error: "subject Id is required"}, {status: 400});
        }

        const subject_related_chapters = await Chapter.find({fk_subject_id: subjectId});
        return NextResponse.json({subject_related_chapters}, {status: 200});

    } catch (error) {
        console.error("Error in get chapter :", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }    
    
}