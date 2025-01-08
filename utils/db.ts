import mongoose from "mongoose";
import { ApiError } from "./api-error";
import { ErrorCodes } from "./error-codes";

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) {
  throw new ApiError(
    ErrorCodes.SERVICE_UNAVAILABLE,
    "Database configuration missing"
  );
}

let cached = global as any;
cached.mongoose = cached.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
  try {
    if (cached.mongoose.conn) {
      console.log("Using existing connection");
      return cached.mongoose.conn;
    }

    if (!cached.mongoose.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
    }

    cached.mongoose.conn = await cached.mongoose.promise;
    console.log("Database connected!");
    return cached.mongoose.conn;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      ErrorCodes.SERVICE_UNAVAILABLE,
      "Database connection failed"
    );
  }
};
