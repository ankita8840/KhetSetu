import Farm from "../models/Farm.js";
import { recommendSchemes } from "../utils/schemesEngine.js";

// @route GET /api/schemes
export const getSchemes = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ user: req.user._id });
    const schemes = recommendSchemes(farm);
    res.json({ schemes });
  } catch (error) {
    next(error);
  }
};
