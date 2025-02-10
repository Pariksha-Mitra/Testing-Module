import mongoose, { Document, Schema } from "mongoose";

interface ITest extends Document {
  test_title: string;
  created_at: Date;
  created_by: string;
  valid_upto: string;
  marks: number;
  questions: mongoose.Types.ObjectId[];
}

const testSchema: Schema = new Schema(
  {
    test_title: {
      type: String,
      required: [true, "Required Field"],
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    created_by: {
      type: String,
      required: [true, "Required Field"],
      trim: true,
    },
    valid_upto: {
      type: String,
      required: [true, "Required Field"],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, "Required Field"],
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "Required Field"],
      },
    ],
  },
  { timestamps: true }
);

export const TestModel: mongoose.Model<ITest> =
  mongoose.models.Test || mongoose.model<ITest>("Test", testSchema);
