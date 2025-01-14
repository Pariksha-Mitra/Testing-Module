import { NextRequest, NextResponse } from "next/server";
import { Subject } from "@/models/questionsSchema";
import { connectDb } from "@/utils/db";

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