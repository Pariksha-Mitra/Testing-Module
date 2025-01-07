import { NextResponse } from "next/server";
import { Question } from "@/server/models/questionsSchema";
import connectDB from "@/server/utils/db";


/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     description: Retrieve a list of all questions with related information.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       questionText:
 *                         type: string
 *                       questionType:
 *                         type: string
 *                       answerFormat:
 *                         type: string
 *                       exerciseTitle:
 *                         type: string
 *                       chapterTitle:
 *                         type: string
 *                       standardName:
 *                         type: string
 *
 * /questions:
 *   post:
 *     summary: Add a new question
 *     description: Create a new question with the required fields.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               standard:
 *                 type: string
 *               chapter:
 *                 type: string
 *               exercise:
 *                 type: string
 *               questionText:
 *                 type: string
 *               questionType:
 *                 type: string
 *               answerFormat:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               numericalAnswer:
 *                 type: number
 *     responses:
 *       201:
 *         description: Question added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 question:
 *                   type: object
 *
 * /questions:
 *   delete:
 *     summary: Delete a question
 *     description: Delete a question by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question to delete
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */


export async function GET() {
  try {
    await connectDB();

    const questions = await Question.find()
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

    const flattenedQuestions = questions.map((question) => {
      const exercise = question.exercise || {};
      const chapter = exercise.chapter || {};
      const standard = chapter.standard || {};

      return {
        _id: question._id,
        questionText: question.questionText,
        questionType: question.questionType,
        answerFormat: question.answerFormat,
        options: question.options,
        numericalAnswer: question.numericalAnswer,
        exerciseTitle: exercise.title,
        exerciseDescription: exercise.description,
        exerciseId: exercise._id,  // Added exercise ID
        chapterTitle: chapter.title,
        chapterDescription: chapter.description,
        chapterId: chapter._id,  // Added chapter ID
        standardName: standard.standardName,
        standardDescription: standard.description,
        standardId: standard._id,  // Added standard ID
      };
    });

    return NextResponse.json({ questions: flattenedQuestions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}




export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      standard,
      chapter,
      exercise,
      questionText,
      questionType,
      answerFormat,
      options,
      numericalAnswer,
    } = body;

    if (!standard || !chapter || !exercise || !questionText || !questionType || !answerFormat) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newQuestion = new Question({
      standard,
      chapter,
      exercise,
      questionText,
      questionType,
      answerFormat,
      options: questionType === "MCQ" ? options : [],
      numericalAnswer: questionType === "Numerical" ? numericalAnswer : null,
    });

    const savedQuestion = await newQuestion.save();

    return NextResponse.json({ message: "Question added successfully", question: savedQuestion });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
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