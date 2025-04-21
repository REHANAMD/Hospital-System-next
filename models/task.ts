import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: String, required: true },
  assignedBy: { type: String },
  dueDate: { type: Date },
  status: { type: String, default: "pending" }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
