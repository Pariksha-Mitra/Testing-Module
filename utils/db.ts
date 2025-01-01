import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectDb = async () => {
  if (connection.isConnected) {
    console.log("Already connected to DB!");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected!");
  } catch (error) {
    console.log("Database connection failed!");
    console.error(error);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1); // Only exit in non-test environments
    } else {
      throw new Error("Failed to connect to the database");
    }
  }
};

