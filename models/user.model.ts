import mongoose, { Schema, Types } from "mongoose";
import { ROLE } from "../utils/types";

interface User extends Document, Schema {
  firstName: string;
  middleName?: string;
  surname: string;
  schoolId: Types.ObjectId;
  slug: string;
  email?: string;
  username: string;
  password: string;
  dateOfBirth: Date;
  image?: string;
  invitationId?: string;
  rollNo?: number;
  division?: division;
  role: ROLE;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

enum division {
  A = "A",
  B = "B",
  C = "C",
}

const userSchema: Schema<User> = new Schema<User>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minLength: [2, "First name must be at least 2 characters"],
    maxLength: [50, "First name must be less than 50 characters"],
  },
  middleName: {
    type: String,
    trim: true,
    maxLength: [50, "Middle name must be less than 50 characters"],
  },
  surname: {
    type: String,
    required: [true, "Surname is required"],
    trim: true,
    minLength: [2, "Surname must be at least 2 characters"],
    maxLength: [50, "Surname must be less than 50 characters"],
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    required: [true, "School ID is required"],
    ref: "School",
    index: true,
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    trim: true,
    unique: true,
    minLength: [3, "Slug must be at least 3 characters"],
    maxLength: [100, "Slug must be less than 100 characters"],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/\S+@\S+\.\S+/, "Invalid email address"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
    minLength: [3, "Username must be at least 3 characters"],
    maxLength: [30, "Username must be less than 30 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters"],
    maxLength: [128, "Password must be less than 128 characters"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: (value: Date) => value < new Date(),
      message: "Date of birth must be in the past",
    },
  },
  image: {
    type: String,
    trim: true,
    maxLength: [500, "Image URL must be less than 500 characters"],
  },
  invitationId: {
    type: String,
    trim: true,
    maxLength: [50, "Invitation ID must be less than 50 characters"],
  },
  role: {
    type: String,
    enum: Object.values(ROLE),
    required: [true, "Role is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  rollNo: {
    type: Number,
  },
  division: {
    type: String,
  },
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default userModel;
