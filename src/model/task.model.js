import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
