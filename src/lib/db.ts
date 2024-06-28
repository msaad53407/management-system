import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`
    );
    console.log(`MongoDB connected at host: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection FAILED", error);
  }
};
