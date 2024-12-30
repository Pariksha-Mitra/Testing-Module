import { NextResponse } from "next/server";
import { Chapter, Standard } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";


export async function GET(){
    try {
        await connectDB();

        const chapters = await Chapter.find();
        return NextResponse.json({chapters}, {status: 200});
        
    } catch (error) {
        return NextResponse.json({error:"Failed to retrive the chapter information"},{status: 400});
    }
}


export async function POST(req: Request) {
  try {
    await connectDB();

    const { title, description, standardId } = await req.json();

    if (!title || !standardId) {
      return NextResponse.json({error: "Title and Standard ID are required" }, {status: 400 });
    }

    const standardExists = await Standard.findById(standardId);
    if (!standardExists) {
      return NextResponse.json({error: "The provided Standard ID does not exist" }, {status: 404 });
    }

    const newChapter = new Chapter({title,  description,  standard: standardId,});
    const savedChapter = await newChapter.save();

    return NextResponse.json({message: "Chapter created successfully", chapter: savedChapter }, {status: 201 });
  } catch (error) {
    console.log("Error creating chapter:", error);
    return NextResponse.json({error: "Failed to create chapter" }, {status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { chapterId } = await req.json();

    if (!chapterId) {return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 });}

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {return NextResponse.json({ error: "Chapter not found" }, { status: 404 });}

    await Chapter.findByIdAndDelete(chapterId);

    return NextResponse.json({ message: "Chapter deleted successfully", chapterId },{ status: 200 });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 });
  }
}