import { NextResponse } from "next/server";
import { Question } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const { questionId } = await context.params;
    const singleQuestion = await Question.findById(questionId);

    if (!singleQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ singleQuestion }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single question:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single question" },
      { status: 500 }
    );
  }
}
