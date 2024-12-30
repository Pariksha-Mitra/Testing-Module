import { NextResponse } from "next/server";
import { Question } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";

export async function GET() {
    try {
      await connectDB();
    const questions = await Question.find().populate("exercise");
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const newQuestion = new Question(body);
    const savedQuestion = await newQuestion.save();
    return NextResponse.json({ success: true, data: savedQuestion }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create question" },{ status: 400 });
  }
}

export async function DELETE(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const questionId = searchParams.get("id");
  
      if (!questionId) {
        return NextResponse.json(
          { success: false, error: "Question ID is required" },{ status: 400 }
        );}
  
      const deletedQuestion = await Question.findByIdAndDelete(questionId);
  
      if (!deletedQuestion) {
        return NextResponse.json(
          { success: false, error: "Question not found" },{ status: 404 }
        );}
  
      return NextResponse.json(
        { success: true, message: "Question deleted successfully" }, { status: 200 }
      );} 

    catch (error) {
      return NextResponse.json(
        { success: false, error: "Failed to delete question" },{ status: 500 });
    }
  }