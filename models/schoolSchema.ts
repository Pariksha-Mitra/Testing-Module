import mongoose, { Document, Model, Schema } from "mongoose";
import { z } from "zod";

// Define the School interface extending mongoose Document
interface ISchool extends Document {
  name: string;
  registeredAt: Date;
  contact: string;
  address: string;
}

// Define the School schema using mongoose
const schoolSchema: Schema<ISchool> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required!"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name must be at most 100 characters long"],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    contact: {
      type: String,
      required: [true, "Contact is required!"],
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Contact must be a valid email address",
      ],
    },
    address: {
      type: String,
      required: [true, "Address is required!"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Create and export the School model
const SchoolModel: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>("School", schoolSchema);
export default SchoolModel;

// Define the School schema using zod
export const schoolSchemaZod = z.object({
  name: z.string().nonempty({ message: "Required!" }),
  contact: z.string().nonempty({ message: "Required!" }),
  address: z.string().nonempty({ message: "Required!" }),
});

export type schoolSchemaType = z.infer<typeof schoolSchemaZod>;
