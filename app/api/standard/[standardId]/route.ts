import { NextResponse } from "next/server";
import { Standard } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();

    const {standardId} = await context.params;
    if (!standardId) {
        return NextResponse.json(
          { success: false, error: "StandardId is required" },
          { status: 400 }
        );
      }

    const standard = await Standard.findById(standardId)
      .populate({
        path: "chapters",
        populate: {
          path: "exercises", 
          populate: {
            path: "questions", 
          },
        },
      })
      .exec();

    if (!standard) {
      return NextResponse.json(
        { success: false, error: "Standard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, standard }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch standard data" },
      { status: 500 }
    );
  }
}
