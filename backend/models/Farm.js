import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    farmerName: { type: String, trim: true },
    village: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    landAreaAcres: { type: Number, default: 0 },
    waterSource: {
      type: String,
      enum: ["Borewell", "Canal", "River", "Rainfed", "Pond", "Other"],
      default: "Rainfed",
    },
    equipment: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model("Farm", farmSchema);
