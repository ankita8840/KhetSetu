import SoilData from "../models/SoilData.js";
import { analyzeSoil } from "../utils/soilAnalysisEngine.js";

// @route POST /api/soil
export const addSoilData = async (req, res, next) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, moisture, organicCarbon, source } = req.body;

    const required = { nitrogen, phosphorus, potassium, ph, moisture, organicCarbon };
    for (const [key, val] of Object.entries(required)) {
      if (val === undefined || val === null || val === "") {
        return res.status(400).json({ message: `${key} is required` });
      }
    }

    const analysisRaw = analyzeSoil(required);

    const soilEntry = await SoilData.create({
      user: req.user._id,
      ...required,
      source: source || "manual",
      analysis: {
        soilHealthScore: analysisRaw.soilHealthScore,
        soilGrade: analysisRaw.soilGrade,
        fertilityStatus: analysisRaw.fertilityStatus,
        waterRetention: analysisRaw.waterRetention,
        deficiencies: analysisRaw.deficiencies,
        fertilizerRecommendation: analysisRaw.fertilizerRecommendation,
      },
    });

    res.status(201).json({ soilEntry, levels: analysisRaw.levels });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/soil
export const getSoilHistory = async (req, res, next) => {
  try {
    const entries = await SoilData.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ entries });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/soil/latest
export const getLatestSoilData = async (req, res, next) => {
  try {
    const latest = await SoilData.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ latest: latest || null });
  } catch (error) {
    next(error);
  }
};
