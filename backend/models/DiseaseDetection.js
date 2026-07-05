import mongoose from "mongoose";

const diseaseDetectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageName: { type: String },
    diseaseName: { type: String, required: true },
    confidence: { type: Number, required: true },
    symptoms: [String],
    treatment: [String],
    prevention: [String],
  },
  { timestamps: true }
);

export default mongoose.model("DiseaseDetection", diseaseDetectionSchema);
