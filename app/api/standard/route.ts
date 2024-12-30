import { NextResponse } from "next/server";
import {Standard} from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";

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
