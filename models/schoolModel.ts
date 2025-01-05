import mongoose, { Schema, Document } from "mongoose";

interface School extends Document {
  name: string;
  schoolId: string;
  registredAt: Date;
  contact: string;
  address: string;
}

const schoolSchema: Schema<School> = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required!"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [100, "Name must be at most 100 characters long"],
  },
  schoolId: {
    type: String,
    required: [true, "School ID is required!"],
    unique: true,
    minlength: [5, "School ID must be at least 5 characters long"],
    maxlength: [20, "School ID must be at most 20 characters long"],
  },
  registredAt: {
    type: Date,
    default: Date.now,
  },
  contact: {
    type: String,
    required: [true, "Contact is required!"],
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Contact must be a valid 10-digit phone number",
    ],
  },
  address: {
    type: String,
    required: [true, "Address is required!"],
    minlength: [10, "Address must be at least 10 characters long"],
    maxlength: [200, "Address must be at most 200 characters long"],
  },
});

const SchoolModel = mongoose.model<School>("School", schoolSchema);
export default SchoolModel;
