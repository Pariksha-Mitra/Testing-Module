import { NextResponse } from "next/server";
import {Standard} from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";
import { Chapter } from "@/server/models/questionsSchema";
import { Exercise } from "@/server/models/questionsSchema";
import { Question } from "@/server/models/questionsSchema";

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

