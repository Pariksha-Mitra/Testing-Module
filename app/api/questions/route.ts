import { connectDb } from '@/utils/db';
import { NextResponse,NextRequest } from 'next/server';
import { Chapter, Exercise, Question, Standard, Subject } from "@/models/questionsSchema";

/**
 * @swagger
 * /api/questions:
 *   get:
 *     tags:
 *       - Questions
 *     summary: Get all questions
 *     description: Fetches all questions from the database, including associated exercise, chapter, and standard details.
 *     responses:
 *       200:
 *         description: Successfully retrieved questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: Failed to fetch questions
 */
export async function GET() {
  try {
    await connectDb();

    const questions = await Question.find()
      .populate({
        path: "fk_exercise_id",
        populate: {
          path: "fk_chapter_id",
          populate: {
            path: "fk_subject_id",
            populate: {
              path: "fk_standard_id",
            },
          },
        },
      })
      .exec();

    const flattenedQuestions = questions.map(async (question) => {
      const exercise = (await Exercise.findById(question.fk_exercise_id));
      const chapter = (await Chapter.findById(question.fk_chapter_id));
      const subject = await Subject.findById(question.fk_subject_id);
      const standard = (await Standard.findById(question.fk_standard_id));

      return {
        _id: question._id,
        questionText: question.questionText,
        questionDescription: question.questionDescription,
        questionType: question.questionType,
        answerFormat: question.answerFormat,
        options: question.options,
        correctAnswer: question.correctAnswer,
        numericalAnswer: question.numericalAnswer,
        exerciseTitle: exercise?.title,
        exerciseDescription: exercise?.description,
        exerciseId: exercise?._id,
        chapterTitle: chapter?.title,
        chapterDescription: chapter?.description,
        chapterId: chapter?._id,
        subjectName: subject?.subjectName,
        subjectDescription: subject?.description,
        subjectId: subject?._id,
        standardName: standard?.standardName,
        standardDescription: standard?.description,
        standardId: standard?._id,
      };
    });

    return NextResponse.json({ questions: flattenedQuestions });
  } catch (error) {
    console.log("error while handling GET req in question", error);

    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/questions:
 *   post:
 *     tags:
 *       - Questions
 *     summary: Add a new question
 *     description: Adds a new question to the database with references to standard, chapter, and exercise.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - standard
 *               - chapter
 *               - exercise
 *               - questionText
 *               - questionType
 *               - answerFormat
 *               - correctAnswer
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
 *               correctAnswer:
 *                 type: string
 *               numericalAnswer:
 *                 type: number
 *     responses:
 *       201:
 *         description: Question added successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Failed to add question.
 */
export async function POST(req: Request) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      standardId,
      subjectId,
      chapterId,
      exerciseId,
      questionText,
      questionDescription,
      questionType,
      answerFormat,
      options,
      correctAnswer,
      numericalAnswer,
    } = body;

    if (
      !standardId ||
      !subjectId ||
      !chapterId ||
      !exerciseId ||
      !questionText ||
      !questionDescription ||
      !questionType ||
      !answerFormat ||
      (questionType === "MCQ" && !correctAnswer) ||
      (questionType === "NUMERICAL" && numericalAnswer == null)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (questionType === "MCQ" && (!options || options.length === 0)) {
      return NextResponse.json(
        { error: "MCQ questions require at least one option." },
        { status: 400 }
      );
    }

    const validAnswerFormats = ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TEXT", "NUMBER", "MCQ"];
    if (!validAnswerFormats.includes(answerFormat)) {
      return NextResponse.json(
        { error: `Invalid answerFormat. Expected one of: ${validAnswerFormats.join(", ")}` },
        { status: 400 }
      );
    }

    const newQuestion = new Question({
      fk_standard_id: standardId,
      fk_subject_id: subjectId,
      fk_chapter_id: chapterId,
      fk_exercise_id: exerciseId,
      questionText,
      questionDescription,
      questionType,
      answerFormat,
      options: questionType === "MCQ" ? options : [],
      correctAnswer,
      numericalAnswer: questionType === "Numerical" ? numericalAnswer : null,
    });

    console.log(newQuestion);

    const savedQuestion = await newQuestion.save();

    return NextResponse.json(
      { message: "Question added successfully", question: savedQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.log("error while handling POST req in question",error);

    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/questions:
 *   delete:
 *     tags:
 *       - Questions
 *     summary: Delete a question
 *     description: Deletes a question by ID from the database.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to delete.
 *     responses:
 *       200:
 *         description: Question deleted successfully.
 *       400:
 *         description: Missing question ID.
 *       404:
 *         description: Question not found.
 *       500:
 *         description: Failed to delete question.
 */
export async function DELETE(req: Request) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("id");

    if (!questionId) {
      return NextResponse.json(
        { success: false, error: "Question ID is required" }, { status: 400 }
      );
    }

    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found" }, { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Question deleted successfully" }, { status: 200 }
    );
  } catch (error) {
    console.log("error while handling DELETE req in question",error);
    return NextResponse.json(
      { success: false, error: "Failed to delete question" }, { status: 500 }
    );
  }
}



export async function PUT(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      questionId,
      standardId,
      subjectId,
      chapterId,
      exerciseId,
      questionText,
      questionDescription,
      questionType,
      answerFormat,
      options,
      correctAnswer,
      numericalAnswer,
    } = body;

    if (
      !standardId ||
      !subjectId ||
      !chapterId ||
      !exerciseId ||
      !questionText ||
      !questionDescription ||
      !questionType ||
      !answerFormat ||
      (questionType === "MCQ" && !correctAnswer) ||
      (questionType === "NUMERICAL" && numericalAnswer == null)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!questionId) {
      return NextResponse.json(
        { error: "questionId is required to identify the question for update" },
        { status: 400 }
      );
    }

    const existingQuestion = await Question.findOne({ _id: questionId });
    if (!existingQuestion) {
      return NextResponse.json(
        { error: "No existing record found for question"},
        { status: 404 }
      );
    }

    if (questionType === "MCQ" && (!options || options.length === 0)) {
      return NextResponse.json(
        { error: "MCQ questions require at least one option." },
        { status: 400 }
      );
    }

    const validAnswerFormats = ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TEXT", "NUMBER", "MCQ"];
    if (answerFormat && !validAnswerFormats.includes(answerFormat)) {
      return NextResponse.json(
        { error: `Invalid answerFormat. Expected one of: ${validAnswerFormats.join(", ")}` },
        { status: 400 }
      );
    }

    if (standardId) existingQuestion.fk_standard_id = standardId;
    if (subjectId) existingQuestion.fk_subject_id = subjectId;
    if (chapterId) existingQuestion.fk_chapter_id = chapterId;
    if (exerciseId) existingQuestion.fk_exercise_id = exerciseId;
    if (questionText) existingQuestion.questionText = questionText;
    if (questionDescription) existingQuestion.questionDescription = questionDescription;
    if (questionType) existingQuestion.questionType = questionType;
    if (answerFormat) existingQuestion.answerFormat = answerFormat;
    if (questionType === "MCQ") {
      existingQuestion.options = options || existingQuestion.options;
      existingQuestion.correctAnswer = correctAnswer || existingQuestion.correctAnswer;
    }
    if (questionType === "NUMERICAL") {
      existingQuestion.numericalAnswer = numericalAnswer != null ? numericalAnswer : existingQuestion.numericalAnswer;
    }

    // Save the updated question to the database
    const updatedQuestion = await existingQuestion.save();

    return NextResponse.json(
      { message: "Question updated successfully", question: updatedQuestion },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while handling PUT request for question:", error);

    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}
