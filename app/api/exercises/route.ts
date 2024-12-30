import { NextResponse } from "next/server";
import { Chapter, Standard, Exercise } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";


export async function GET(){
    try {
        await connectDB();

        const chapters = await Exercise.find();
        return NextResponse.json({chapters}, {status: 200});
        
    } catch (error) {
        return NextResponse.json({error:"Failed to retrive the chapter information"},{status: 400});
    }
}

export async function POST(req: Request) {
    try {
      await connectDB();
  
      const { title, description, chapterId } = await req.json();
  
      if (!title || !description || !chapterId) {
        return NextResponse.json(
          { error: "Title, description, and chapterId are required" },
          { status: 400 }
        );
      }
  
      const newExercise = new Exercise({
        title,
        description,
        chapter: chapterId,
      });
      const savedExercise = await newExercise.save();
  
      return NextResponse.json(
        { message: "Exercise created successfully", exercise: savedExercise },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating exercise:", error);
      return NextResponse.json(
        { error: "Failed to create the exercise" },
        { status: 500 }
      );
    }
  }

  export async function DELETE(req: Request) {
    try {
      await connectDB();
  
      const { searchParams } = new URL(req.url);
      const exerciseId = searchParams.get("id");
  
      if (!exerciseId) {
        return NextResponse.json(
          { error: "Exercise ID is required" },
          { status: 400 }
        );
      }
  
      const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);
  
      if (!deletedExercise) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Exercise deleted successfully", exercise: deletedExercise },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting exercise:", error);
      return NextResponse.json(
        { error: "Failed to delete the exercise" },
        { status: 500 }
      );
    }
  }
  
