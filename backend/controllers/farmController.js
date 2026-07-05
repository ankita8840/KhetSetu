import Farm from "../models/Farm.js";

// @route GET /api/farm
export const getFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ user: req.user._id });
    res.json({ farm: farm || null });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/farm
export const upsertFarm = async (req, res, next) => {
  try {
    const { farmerName, village, district, state, landAreaAcres, waterSource, equipment } = req.body;

    const farm = await Farm.findOneAndUpdate(
      { user: req.user._id },
      { farmerName, village, district, state, landAreaAcres, waterSource, equipment, user: req.user._id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ farm });
  } catch (error) {
    next(error);
  }
};
