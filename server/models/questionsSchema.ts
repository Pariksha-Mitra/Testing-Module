import mongoose from "mongoose";

const standardSchema = new mongoose.Schema({
  standardName: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

const chapterSchema = new mongoose.Schema({
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Standard",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const exerciseSchema = new mongoose.Schema({
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const questionSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: ["MCQ", "True/False", "Numerical"],
  },
  answerFormat: {
    type: String,
    required: true,
    enum: ["MCQ", "True/False", "Numerical"],
  },
  options: {
    type: [String], 
  },
  numericalAnswer: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Standard = mongoose.models.Standard || mongoose.model("Standard", standardSchema);
export const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
export const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);