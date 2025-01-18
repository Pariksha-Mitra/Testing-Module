import { NextRequest, NextResponse } from "next/server";
import { Subject } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";

/**
 * @swagger
 * /api/exercises/get-subject:
 *   post:
 *     summary: Fetch subjects related to a specific standard
 *     description: Retrieve a list of subjects associated with a given standard ID from the database.
 *     tags:
 *       - Subjects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               standardId:
 *                 type: string
 *                 description: The ID of the standard to fetch subjects for.
 *                 example: "64a12345b7e89d1234567890"
 *     responses:
 *       200:
 *         description: Successfully retrieved subjects for the specified standard.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 standard_related_subjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the subject.
 *                         example: "64f12345c7e89d1234567890"
 *                       name:
 *                         type: string
 *                         description: The name of the subject.
 *                         example: "Mathematics"
 *                       fk_standard_id:
 *                         type: string
 *                         description: The foreign key standard ID associated with the subject.
 *                         example: "64a12345b7e89d1234567890"
 *       400:
 *         description: Bad Request. Missing or invalid standardId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "standard Id is required"
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
        // const standardId = req.json();
        const { standardId } = await req.json();

        if(!standardId){
            return NextResponse.json({error: "standard Id is required"}, {status: 400});
        }
        const standard_related_subjects = await Subject.find({fk_standard_id: standardId});
        return NextResponse.json({standard_related_subjects}, {status: 200});

    } catch (error) {
        console.error("Error in get-subject", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}