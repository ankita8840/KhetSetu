import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expertName: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Sample Collected", "Testing", "Completed"],
      default: "Pending",
    },
    reportUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
