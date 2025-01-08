import { NextResponse } from "next/server";
import { Question } from "@/models/questionsSchema";
import {connectDB} from "@/utils/db";

/**
 * @swagger
 * paths:
 *   /api/questions:
 *     get:
 *       tags:
 *         - Questions
 *       summary: "Get a list of all questions with their related exercise, chapter, and standard data"
 *       description: "Retrieve all questions with their associated exercises, chapters, and standards."
 *       responses:
 *         200:
 *           description: "Successfully retrieved all questions and their related data."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   questions:
 *                     type: "array"
 *                     items:
 *                       $ref: "#/components/schemas/Question"
 *         500:
 *           description: "Failed to fetch the questions."
 *   /api/questions:
 *     post:
 *       tags:
 *         - Questions
 *       summary: "Add a new question"
 *       description: "Add a new question to the database, including its standard, chapter, exercise, and other relevant details."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 standard:
 *                   type: "string"
 *                 chapter:
 *                   type: "string"
 *                 exercise:
 *                   type: "string"
 *                 questionText:
 *                   type: "string"
 *                 questionType:
 *                   type: "string"
 *                 answerFormat:
 *                   type: "string"
 *                 options:
 *                   type: "array"
 *                   items:
 *                     type: "string"
 *                 correctAnswer:
 *                   type: "string"
 *                 numericalAnswer:
 *                   type: "number"
 *       responses:
 *         200:
 *           description: "Successfully added a new question."
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   message:
 *                     type: "string"
 *                   question:
 *                     $ref: "#/components/schemas/Question"
 *         400:
 *           description: "Missing required fields."
 *         500:
 *           description: "Failed to add the question."
 *   /api/questions:
 *     delete:
 *       tags:
 *         - Questions
 *       summary: "Delete a question by its ID"
 *       description: "Delete a question based on its ID."
 *       parameters:
 *         - name: "id"
 *           in: "query"
 *           required: true
 *           description: "The ID of the question to delete."
 *           schema:
 *             type: "string"
 *       responses:
 *         200:
 *           description: "Successfully deleted the question."
 *         400:
 *           description: "Question ID is required."
 *         404:
 *           description: "Question not found."
 *         500:
 *           description: "Failed to delete the question."
 * 
 * components:
 *   schemas:
 *     Question:
 *       type: "object"
 *       properties:
 *         _id:
 *           type: "string"
 *         questionText:
 *           type: "string"
 *         questionType:
 *           type: "string"
 *         answerFormat:
 *           type: "string"
 *         options:
 *           type: "array"
 *           items:
 *             type: "string"
 *         correctAnswer:
 *           type: "string"
 *         numericalAnswer:
 *           type: "number"
 *         exerciseTitle:
 *           type: "string"
 *         exerciseDescription:
 *           type: "string"
 *         exerciseId:
 *           type: "string"
 *         chapterTitle:
 *           type: "string"
 *         chapterDescription:
 *           type: "string"
 *         chapterId:
 *           type: "string"
 *         standardName:
 *           type: "string"
 *         standardDescription:
 *           type: "string"
 *         standardId:
 *           type: "string"
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
        correctAnswer: question.correctAnswer,
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
    console.log(body);

    const {
      standard,
      chapter,
      exercise,
      questionText,
      questionType,
      answerFormat,
      options,
      correctAnswer,
      numericalAnswer,
    } = body;

    console.log("correct answer = ",correctAnswer)

    if (!standard || !chapter || !exercise || !questionText || !questionType || !answerFormat || !correctAnswer) {
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
      correctAnswer,
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