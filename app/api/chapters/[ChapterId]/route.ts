import { NextResponse } from "next/server";
import { Chapter } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const { ChapterId } = await context.params;
    const singleChapter = await Chapter.findById(ChapterId);

    if (!singleChapter) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ singleChapter }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single chapter:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single chapter" },
      { status: 500 }
    );
  }
}
