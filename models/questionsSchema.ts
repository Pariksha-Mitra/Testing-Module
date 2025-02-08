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
  questionDescription: string,
  questionType: QuestionTypeEnum;
  answerFormat: AnswerFormatEnum;
  options?: string[];
  correctAnswer?: string;
  numericalAnswer?: number;
}

// Standard Schema
const standardSchema: Schema = new mongoose.Schema(
  {
    standardName: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Subject Schema
const subjectSchema: Schema = new mongoose.Schema(
  {
    fk_standard_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
      index: true,
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
const chapterSchema: Schema = new mongoose.Schema(
  {
    fk_subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
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
const exerciseSchema: Schema = new mongoose.Schema(
  {
    fk_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
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
const questionSchema: Schema = new mongoose.Schema(
  {
    fk_standard_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
      index: true,
    },
    fk_subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    fk_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },
    fk_exercise_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    questionDescription: {
      type: String,
      trim: true,
    },
    questionType: {
      type: String,
      required: true,
      enum: Object.values(QuestionTypeEnum),
    },
    answerFormat: {
      type: String,
      required: true,
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
        },
        message: "Options must contain at least one item for MCQ.",
      },
    },
    correctAnswer: {
      type: String,
      required: function (this: IQuestion) {
        return this.questionType === QuestionTypeEnum.MCQ;
      },
    },
    numericalAnswer: {
      type: Number,
      required: function (this: IQuestion) {
        return this.questionType === QuestionTypeEnum.NUMERICAL;
      },
    },
  },
  { timestamps: true }
);

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
