import SoilData from "../models/SoilData.js";
import Farm from "../models/Farm.js";
import { recommendCrops, checkCropCompatibility } from "../utils/cropRecommendationEngine.js";

// @route GET /api/crop/recommend?season=Kharif
export const getCropRecommendations = async (req, res, next) => {
  try {
    const { season } = req.query;

    const latestSoil = await SoilData.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!latestSoil) {
      return res.status(400).json({ message: "Please add soil data first to get crop recommendations" });
    }

    const farm = await Farm.findOne({ user: req.user._id });
    const waterSource = farm?.waterSource || "Rainfed";

    // Recompute simple N/P/K levels for crop matching (re-derive from raw values)
    const { analyzeSoil } = await import("../utils/soilAnalysisEngine.js");
    const { levels } = analyzeSoil({
      nitrogen: latestSoil.nitrogen,
      phosphorus: latestSoil.phosphorus,
      potassium: latestSoil.potassium,
      ph: latestSoil.ph,
      moisture: latestSoil.moisture,
      organicCarbon: latestSoil.organicCarbon,
    });

    const recommendations = recommendCrops({
      soilLevels: levels,
      ph: latestSoil.ph,
      season: season || "Any",
      waterSource,
    });

    res.json({ recommendations, basedOn: { soilHealthScore: latestSoil.analysis.soilHealthScore, waterSource } });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/crop/compatibility
export const getCropCompatibility = async (req, res, next) => {
  try {
    const { cropName } = req.body;
    if (!cropName) return res.status(400).json({ message: "cropName is required" });

    const latestSoil = await SoilData.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!latestSoil) {
      return res.status(400).json({ message: "Please add soil data first" });
    }

    const farm = await Farm.findOne({ user: req.user._id });
    const waterSource = farm?.waterSource || "Rainfed";

    const { analyzeSoil } = await import("../utils/soilAnalysisEngine.js");
    const { levels } = analyzeSoil({
      nitrogen: latestSoil.nitrogen,
      phosphorus: latestSoil.phosphorus,
      potassium: latestSoil.potassium,
      ph: latestSoil.ph,
      moisture: latestSoil.moisture,
      organicCarbon: latestSoil.organicCarbon,
    });

    const result = checkCropCompatibility({ cropName, soilLevels: levels, ph: latestSoil.ph, waterSource });
    if (!result) return res.status(404).json({ message: "Crop not found in database" });

    res.json({ result });
  } catch (error) {
    next(error);
  }
};
