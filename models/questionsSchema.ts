import mongoose from "mongoose";

const QuestionTypeEnum = ["MCQ", "True/False", "Numerical"];
const AnswerFormatEnum = ["MCQ", "True/False", "Numerical"];

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


const chapterSchema = new mongoose.Schema(
  {
    standard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
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

const exerciseSchema = new mongoose.Schema(
  {
    chapter: {
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

const questionSchema = new mongoose.Schema(
  {
    standard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    exercise: {
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
      enum: AnswerFormatEnum,
    },
    options: {
      type: [String],
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "Options must contain at least one item.",
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

export const Standard = mongoose.models.Standard || mongoose.model("Standard", standardSchema);
export const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
export const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
