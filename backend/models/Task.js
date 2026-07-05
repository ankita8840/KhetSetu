import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Irrigation", "Fertilizer", "Harvest", "Soil Testing", "Other"],
      default: "Other",
    },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
