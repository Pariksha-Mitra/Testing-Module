import { NextResponse } from "next/server";
import { Chapter, Standard, Exercise, Question } from "@/server/models/questionsSchema";
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

    // Parse the request body
    const { title, description, standardId } = await req.json();

    // Validate required fields
    if (!title || !standardId) {
      return NextResponse.json(
        { error: "Title and Standard ID are required" },
        { status: 400 }
      );
    }

    // Check if the provided Standard exists
    const standardExists = await Standard.findById(standardId);
    if (!standardExists) {
      return NextResponse.json(
        { error: "The provided Standard ID does not exist" },
        { status: 404 }
      );
    }

    // Create a new Chapter document
    const newChapter = new Chapter({
      title,
      description,
      standard: standardId,
    });

    // Save the Chapter to the database
    const savedChapter = await newChapter.save();

    // Return a success response
    return NextResponse.json(
      {
        message: "Chapter created successfully",
        chapter: {
          _id: savedChapter._id,
          title: savedChapter.title,
          description: savedChapter.description,
          standard: savedChapter.standard,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Failed to create chapter" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    await connectDB();

    // Extract chapter ID from query parameters
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("id");

    if (!chapterId) {
      return NextResponse.json(
        { error: "Chapter ID is required" },
        { status: 400 }
      );
    }

    // Check if the chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    // Find and delete related exercises
    const exercisesToDelete = await Exercise.find({ chapter: chapterId });
    const exerciseIds = exercisesToDelete.map((exercise) => exercise._id);

    // Find and delete related questions for the exercises
    await Question.deleteMany({ exercise: { $in: exerciseIds } });

    // Delete the exercises
    await Exercise.deleteMany({ _id: { $in: exerciseIds } });

    // Finally, delete the chapter
    await Chapter.findByIdAndDelete(chapterId);

    return NextResponse.json(
      {
        message: "Chapter and related data deleted successfully",
        chapterId,
        deletedExercises: exerciseIds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting chapter and related data:", error);
    return NextResponse.json(
      { error: "Failed to delete chapter and related data" },
      { status: 500 }
    );
  }
}
