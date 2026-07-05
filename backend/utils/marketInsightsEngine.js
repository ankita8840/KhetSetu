/**
 * Market Insights Engine — DEMO DATA
 * Live mandi prices would come from data.gov.in's Agmarknet API (requires a
 * free API key). Until DATA_GOV_API_KEY is configured, this returns
 * realistic mock price data with simple trend-based predictions so the
 * dashboard is fully functional for demos.
 */

const MANDI_DB = [
  { crop: "Wheat", market: "Lucknow Mandi", price: 2250, unit: "per quintal", trend: 1.8 },
  { crop: "Rice (Paddy)", market: "Kanpur Mandi", price: 2050, unit: "per quintal", trend: -0.6 },
  { crop: "Sugarcane", market: "Meerut Mandi", price: 360, unit: "per quintal", trend: 0.9 },
  { crop: "Cotton", market: "Indore Mandi", price: 6800, unit: "per quintal", trend: 2.4 },
  { crop: "Onion", market: "Nashik Mandi", price: 1450, unit: "per quintal", trend: -3.2 },
  { crop: "Potato", market: "Agra Mandi", price: 1100, unit: "per quintal", trend: 1.1 },
  { crop: "Soybean", market: "Indore Mandi", price: 4350, unit: "per quintal", trend: 0.5 },
  { crop: "Mustard", market: "Jaipur Mandi", price: 5400, unit: "per quintal", trend: 1.3 },
];

export const getMandiPrices = () => MANDI_DB;

export const getPricePrediction = (cropName) => {
  const entry = MANDI_DB.find((m) => m.crop.toLowerCase() === cropName.toLowerCase());
  if (!entry) return null;

  const predictedPrice = Math.round(entry.price * (1 + entry.trend / 100));
  const recommendation = entry.trend > 1 ? "Hold" : entry.trend < -1 ? "Sell" : "Hold";
  const reason =
    entry.trend > 1
      ? "Prices are trending upward; holding may fetch a better rate soon."
      : entry.trend < -1
      ? "Prices are trending downward; selling now may avoid further loss."
      : "Prices are stable; either action is reasonable.";

  return {
    crop: entry.crop,
    currentPrice: entry.price,
    predictedPrice,
    trendPercent: entry.trend,
    recommendation,
    reason,
    bestMarket: entry.market,
  };
};
