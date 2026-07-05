import { getMandiPrices, getPricePrediction } from "../utils/marketInsightsEngine.js";

// @route GET /api/market/prices
export const getPrices = (req, res) => {
  res.json({ prices: getMandiPrices(), demo: !process.env.DATA_GOV_API_KEY });
};

// @route GET /api/market/predict?crop=Wheat
export const getPrediction = (req, res) => {
  const { crop } = req.query;
  if (!crop) return res.status(400).json({ message: "crop query param is required" });

  const prediction = getPricePrediction(crop);
  if (!prediction) return res.status(404).json({ message: "Crop not found in market data" });

  res.json({ prediction });
};
