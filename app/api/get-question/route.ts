import { NextRequest, NextResponse } from "next/server";
import { Question } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";

export async function POST(req:NextRequest) {
    try {
        await connectDb();
        const {exerciseId} = await req.json();
        if(!exerciseId){
            return NextResponse.json({error: "Exercise Id is required"}, {status: 400})
        }
        const exercise_related_questions = await Question.find({fk_exercise_id: exerciseId});
        return NextResponse.json({exercise_related_questions}, {status: 200});

    } catch (error) {
        console.error("Error in get-question", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
    
}