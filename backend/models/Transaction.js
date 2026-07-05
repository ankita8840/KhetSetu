import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["expense", "income"], required: true },
    category: {
      type: String,
      enum: ["Seeds", "Fertilizers", "Labor", "Machinery", "Crop Sale", "Other"],
      default: "Other",
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
