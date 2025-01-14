<<<<<<< HEAD
import mongoose from "mongoose";

// Existing Enums
const QuestionTypeEnum = ["MCQ", "True/False", "Numerical"];

// Standard Schema
const standardSchema = new mongoose.Schema(
=======
import mongoose, { Document, Model, Schema } from 'mongoose';

// Enums for clarity
enum QuestionTypeEnum {
  MCQ = "MCQ",
  TRUE_FALSE = "TRUE_FALSE",
  NUMERICAL = "NUMERICAL",
}

enum AnswerFormatEnum {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  MCQ = "MCQ",
}

// Interfaces for schemas
interface IStandard extends Document {
  standardName: number;
  description?: string;
}

interface ISubject extends Document {
  fk_standard_id: mongoose.Types.ObjectId;
  subjectName: string;
  description?: string;
}

interface IChapter extends Document {
  fk_subject_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
}

interface IExercise extends Document {
  fk_chapter_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
}

interface IQuestion extends Document {
  fk_standard_id: mongoose.Types.ObjectId;
  fk_subject_id: mongoose.Types.ObjectId;
  fk_chapter_id: mongoose.Types.ObjectId;
  fk_exercise_id: mongoose.Types.ObjectId;
  questionText: string;
  questionType: QuestionTypeEnum;
  answerFormat: AnswerFormatEnum;
  options?: string[];
  correctAnswer?: string;
  numericalAnswer?: number;
}

// Standard Schema
const standardSchema: Schema = new mongoose.Schema(
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
  {
    standardName: {
      type: Number,
      required: true,
<<<<<<< HEAD
      unique: true, 
=======
      unique: true,
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Subject Schema
<<<<<<< HEAD
const subjectSchema = new mongoose.Schema(
=======
const subjectSchema: Schema = new mongoose.Schema(
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
  {
    fk_standard_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
<<<<<<< HEAD
=======
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Chapter Schema
<<<<<<< HEAD
const chapterSchema = new mongoose.Schema(
=======
const chapterSchema: Schema = new mongoose.Schema(
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
  {
    fk_subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
<<<<<<< HEAD
=======
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Exercise Schema
<<<<<<< HEAD
const exerciseSchema = new mongoose.Schema(
=======
const exerciseSchema: Schema = new mongoose.Schema(
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
  {
    fk_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
<<<<<<< HEAD
=======
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Question Schema
<<<<<<< HEAD
const questionSchema = new mongoose.Schema(
=======
const questionSchema: Schema = new mongoose.Schema(
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
  {
    fk_standard_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
<<<<<<< HEAD
=======
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    fk_subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
<<<<<<< HEAD
=======
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    fk_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
<<<<<<< HEAD
=======
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    fk_exercise_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
<<<<<<< HEAD
=======
      index: true,
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    questionType: {
      type: String,
      required: true,
<<<<<<< HEAD
      enum: QuestionTypeEnum,
=======
      enum: Object.values(QuestionTypeEnum),
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
    },
    answerFormat: {
      type: String,
      required: true,
<<<<<<< HEAD
      enum: ["SingleChoice", "MultipleChoice", "Text", "Number", "MCQ"], // Added "MCQ"
    },
    options: {
      type: [String],
      default: [], // Ensures options is an empty array by default
      validate: {
        validator: function (value) {
          return this.questionType === "MCQ" ? value && value.length > 0 : true;
=======
      enum: Object.values(AnswerFormatEnum),
    },
    options: {
      type: [String],
      default: [],
      validate: {
        validator: function (this: IQuestion, value: string[]) {
          return this.questionType === QuestionTypeEnum.MCQ
            ? value && value.length > 0
            : true;
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
        },
        message: "Options must contain at least one item for MCQ.",
      },
    },
    correctAnswer: {
<<<<<<< HEAD
      type: String, // Could be an index of `options` or the actual answer text
      required: function () {
        return this.questionType === "MCQ";
=======
      type: String,
      required: function (this: IQuestion) {
        return this.questionType === QuestionTypeEnum.MCQ;
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
      },
    },
    numericalAnswer: {
      type: Number,
<<<<<<< HEAD
      required: function () {
        return this.questionType === "Numerical";
=======
      required: function (this: IQuestion) {
        return this.questionType === QuestionTypeEnum.NUMERICAL;
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
      },
    },
  },
  { timestamps: true }
);

<<<<<<< HEAD


// Model exports
export const Standard = mongoose.models.Standard || mongoose.model("Standard", standardSchema);
export const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
export const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
export const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
=======
// Model exports
export const Standard: Model<IStandard> =
  mongoose.models.Standard ||
  mongoose.model<IStandard>("Standard", standardSchema);
export const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", subjectSchema);
export const Chapter: Model<IChapter> =
  mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", chapterSchema);
export const Exercise: Model<IExercise> =
  mongoose.models.Exercise ||
  mongoose.model<IExercise>("Exercise", exerciseSchema);
export const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", questionSchema);
>>>>>>> 27dc760d1966fbfd9c1061c7f9944a401d916c6e
