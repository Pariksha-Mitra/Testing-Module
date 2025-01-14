import { NextRequest, NextResponse } from "next/server";
import { Exercise } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";

export async function POST(req:NextRequest) {
    try {
        await connectDb();
        const {chapterId} = await req.json();
        if(!chapterId){
            return NextResponse.json({error: "Chapter Id is required"}, {status: 400});
        }
        const chapter_related_exercise = await Exercise.find({fk_chapter_id: chapterId});
        return NextResponse.json({chapter_related_exercise},{status: 200});

    } catch (error) {
        console.error("Error in get exericse:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}