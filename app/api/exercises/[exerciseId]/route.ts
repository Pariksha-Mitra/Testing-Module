import { NextResponse } from "next/server";
import { Exercise } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const { ChapterId } = await context.params;
    const singleExercise = await Exercise.findById(ChapterId);

    if (!singleExercise) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ singleExercise }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single exercise:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single chapter exercise" },
      { status: 500 }
    );
  }
}
