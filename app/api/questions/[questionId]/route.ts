import { connectDb } from '@/utils/db';
import { NextResponse } from 'next/server';
import { Question } from '@/models/questionsSchema';

// Define the type for context
interface Context {
  params: {
    questionId: string;
  };
}

/**
 * @swagger
 * /api/questions/{questionId}:
 *   get:
 *     tags:
 *       - Questions
 *     summary: Get a single question by its ID
 *     description: Retrieve a question by its ID along with related details such as exercise, chapter, and standard.
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 singleQuestion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     questionText:
 *                       type: string
 *                     questionType:
 *                       type: string
 *                     answerFormat:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     numericalAnswer:
 *                       type: number
 *                     exerciseTitle:
 *                       type: string
 *                     exerciseDescription:
 *                       type: string
 *                     exerciseId:
 *                       type: string
 *                     chapterTitle:
 *                       type: string
 *                     chapterDescription:
 *                       type: string
 *                     chapterId:
 *                       type: string
 *                     standardName:
 *                       type: string
 *                     standardDescription:
 *                       type: string
 *                     standardId:
 *                       type: string
 *       404:
 *         description: Question not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Failed to retrieve the question due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function GET(req: Request, context: Context) {
  try {
    // Connect to the database
    await connectDb();

    // Extract the questionId from the request params
    const { questionId } = context.params;
    console.log("questionId = ", questionId);

    // Fetch the single question by its ID and populate the related documents
    const singleQuestion = await Question.findById(questionId)
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

    // If the question doesn't exist, return an error
    if (!singleQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
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
      correctAnswer: singleQuestion.correctAnswer,
      numericalAnswer: singleQuestion.numericalAnswer,
      exerciseTitle: singleQuestion.fk_exercise_id?.title,
      exerciseDescription: singleQuestion.fk_exercise_id?.description,
      exerciseId: singleQuestion.fk_exercise_id?._id, // Added exercise ID
      chapterTitle: singleQuestion.fk_exercise_id?.fk_chapter_id?.title,
      chapterDescription:
        singleQuestion.fk_exercise_id?.fk_chapter_id?.description,
      chapterId: singleQuestion.fk_exercise_id?.fk_chapter_id?._id, // Added chapter ID
      subjectName: singleQuestion.fk_subject_id?.subjectName, // Updated to use fk_subject_id
      subjectDescription: singleQuestion.fk_subject_id?.description, // Updated to use fk_subject_id
      subjectId: singleQuestion.fk_subject_id?._id, // Updated to use fk_subject_id
      standardName:
        singleQuestion.fk_exercise_id?.fk_chapter_id?.fk_standard_id
          ?.standardName,
      standardDescription:
        singleQuestion.fk_exercise_id?.fk_chapter_id?.fk_standard_id
          ?.description,
      standardId:
        singleQuestion.fk_exercise_id?.fk_chapter_id?.fk_standard_id?._id, // Added standard ID
    };

    // Return the flattened data
    return NextResponse.json(
      { success: true, singleQuestion: flattenedQuestion },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving single question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve the single question" },
      { status: 500 }
    );
  }
}
