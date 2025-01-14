import { NextRequest, NextResponse } from "next/server";
import { Chapter } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";


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