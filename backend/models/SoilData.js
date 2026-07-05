import mongoose from "mongoose";

const soilDataSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    ph: { type: Number, required: true },
    moisture: { type: Number, required: true },
    organicCarbon: { type: Number, required: true },
    source: { type: String, enum: ["manual", "upload"], default: "manual" },

    // AI analysis output (computed by soilAnalysisEngine)
    analysis: {
      soilHealthScore: Number,
      soilGrade: String,
      fertilityStatus: String,
      waterRetention: String,
      deficiencies: [String],
      fertilizerRecommendation: [
        {
          name: String,
          reason: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("SoilData", soilDataSchema);
