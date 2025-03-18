import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });
    mongoose.connection.on("error", (error) => {
      console.error("Database connection error.", error);
    });
  } catch (error) {
    console.error("Database connection error.", error);
    process.exit(1);
  }
};

export default connectDB;
