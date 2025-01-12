import mongoose from "mongoose";

// Existing Enums
const QuestionTypeEnum = ["MCQ", "True/False", "Numerical"];
const AnswerFormatEnum = ["MCQ", "True/False", "Numerical"];

// Standard Schema
const standardSchema = new mongoose.Schema(
  {
    standardName: {
      type: Number,
      required: true,
      unique: true, 
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Subject Schema
const subjectSchema = new mongoose.Schema(
  {
    fk_standard_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
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
const chapterSchema = new mongoose.Schema(
  {
    fk_subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
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
const exerciseSchema = new mongoose.Schema(
  {
    fk_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
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
const questionSchema = new mongoose.Schema(
  {
    fk_standard_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
    },
    fk_subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    fk_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    fk_exercise_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
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
      enum: QuestionTypeEnum,
    },
    answerFormat: {
      type: String,
      required: true,
      enum: ["SingleChoice", "MultipleChoice", "Text", "Number", "MCQ"], // Added "MCQ"
    },
    options: {
      type: [String],
      default: [], // Ensures options is an empty array by default
      validate: {
        validator: function (value) {
          return this.questionType === "MCQ" ? value && value.length > 0 : true;
        },
        message: "Options must contain at least one item for MCQ.",
      },
    },
    correctAnswer: {
      type: String, // Could be an index of `options` or the actual answer text
      required: function () {
        return this.questionType === "MCQ";
      },
    },
    numericalAnswer: {
      type: Number,
      required: function () {
        return this.questionType === "Numerical";
      },
    },
  },
  { timestamps: true }
);



// Model exports
export const Standard = mongoose.models.Standard || mongoose.model("Standard", standardSchema);
export const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
export const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
export const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
