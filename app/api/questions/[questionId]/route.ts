import { NextResponse } from "next/server";
import { Question } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";

export async function GET(req: Request, context: any) {
  try {
    // Connect to the database
    await connectDB();

    // Extract the questionId from the request params
    const { questionId } = await context.params;

    // Fetch the single question by its ID and populate the related documents
    const singleQuestion = await Question.findById(questionId)
      .populate({
        path: "exercise",
        populate: {
          path: "chapter",
          populate: {
            path: "standard",
          },
        },
      })
      .exec();

    // If the question doesn't exist, return an error
    if (!singleQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Flatten the populated data and include the IDs for exercise, chapter, and standard
    const flattenedQuestion = {
      _id: singleQuestion._id,
      questionText: singleQuestion.questionText,
      questionType: singleQuestion.questionType,
      answerFormat: singleQuestion.answerFormat,
      options: singleQuestion.options,
      numericalAnswer: singleQuestion.numericalAnswer,
      exerciseTitle: singleQuestion.exercise?.title,
      exerciseDescription: singleQuestion.exercise?.description,
      exerciseId: singleQuestion.exercise?._id,  // Added exercise ID
      chapterTitle: singleQuestion.exercise?.chapter?.title,
      chapterDescription: singleQuestion.exercise?.chapter?.description,
      chapterId: singleQuestion.exercise?.chapter?._id,  // Added chapter ID
      standardName: singleQuestion.exercise?.chapter?.standard?.standardName,
      standardDescription: singleQuestion.exercise?.chapter?.standard?.description,
      standardId: singleQuestion.exercise?.chapter?.standard?._id,  // Added standard ID
    };

    // Return the flattened data
    return NextResponse.json({ singleQuestion: flattenedQuestion }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving single question:", error);
    return NextResponse.json(
      { error: "Failed to retrieve the single question" },
      { status: 500 }
    );
  }
}
