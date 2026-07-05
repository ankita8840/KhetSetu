/**
 * Rule-based Crop Recommendation Engine
 * Matches current soil analysis + season + water source against a reference
 * database of common Indian crops to produce ranked recommendations.
 *
 * Structured so it can later be replaced by a trained ML model service
 * without changing the input/output contract used by the controller.
 */

const CROP_DB = [
  { name: "Wheat", season: "Rabi", idealPh: [6.0, 7.5], waterNeed: "Medium", n: "Medium", p: "Medium", k: "Medium", profitPotential: "Medium" },
  { name: "Rice (Paddy)", season: "Kharif", idealPh: [5.5, 7.0], waterNeed: "High", n: "High", p: "Medium", k: "Medium", profitPotential: "Medium" },
  { name: "Maize", season: "Kharif", idealPh: [5.5, 7.5], waterNeed: "Medium", n: "High", p: "Medium", k: "Medium", profitPotential: "Medium" },
  { name: "Sugarcane", season: "Annual", idealPh: [6.0, 7.5], waterNeed: "High", n: "High", p: "High", k: "High", profitPotential: "High" },
  { name: "Cotton", season: "Kharif", idealPh: [6.0, 8.0], waterNeed: "Medium", n: "Medium", p: "Medium", k: "Medium", profitPotential: "High" },
  { name: "Soybean", season: "Kharif", idealPh: [6.0, 7.5], waterNeed: "Medium", n: "Low", p: "Medium", k: "Medium", profitPotential: "Medium" },
  { name: "Mustard", season: "Rabi", idealPh: [6.0, 7.5], waterNeed: "Low", n: "Medium", p: "Low", k: "Low", profitPotential: "Medium" },
  { name: "Chickpea (Gram)", season: "Rabi", idealPh: [6.0, 7.5], waterNeed: "Low", n: "Low", p: "Medium", k: "Low", profitPotential: "Medium" },
  { name: "Potato", season: "Rabi", idealPh: [5.0, 6.5], waterNeed: "Medium", n: "High", p: "High", k: "High", profitPotential: "High" },
  { name: "Onion", season: "Rabi", idealPh: [6.0, 7.5], waterNeed: "Medium", n: "Medium", p: "Medium", k: "Medium", profitPotential: "High" },
  { name: "Tomato", season: "Zaid", idealPh: [6.0, 7.0], waterNeed: "Medium", n: "Medium", p: "High", k: "High", profitPotential: "High" },
  { name: "Groundnut", season: "Kharif", idealPh: [6.0, 7.5], waterNeed: "Low", n: "Low", p: "Medium", k: "Medium", profitPotential: "Medium" },
];

const levelMatch = (cropLevel, soilLevel) => {
  if (cropLevel === soilLevel) return 1;
  const order = ["Low", "Medium", "High"];
  const diff = Math.abs(order.indexOf(cropLevel) - order.indexOf(soilLevel));
  return diff === 1 ? 0.55 : 0.2;
};

const waterMatch = (cropNeed, waterSource) => {
  const highSources = ["Canal", "River", "Borewell"];
  const available = highSources.includes(waterSource) ? "High" : waterSource === "Pond" ? "Medium" : "Low";
  return levelMatch(cropNeed, available);
};

export const recommendCrops = ({ soilLevels, ph, season, waterSource }) => {
  const results = CROP_DB.filter((c) => !season || season === "Any" || c.season === season || c.season === "Annual").map((crop) => {
    let score = 0;
    score += levelMatch(crop.n, soilLevels.nitrogen) * 25;
    score += levelMatch(crop.p, soilLevels.phosphorus) * 20;
    score += levelMatch(crop.k, soilLevels.potassium) * 20;
    score += (ph >= crop.idealPh[0] && ph <= crop.idealPh[1] ? 1 : 0.4) * 15;
    score += waterMatch(crop.waterNeed, waterSource) * 20;

    const suitablePercent = Math.round(Math.min(100, score));
    const riskLevel = suitablePercent >= 75 ? "Low" : suitablePercent >= 55 ? "Medium" : "High";

    return {
      crop: crop.name,
      season: crop.season,
      suitablePercent,
      riskLevel,
      waterNeed: crop.waterNeed,
      profitPotential: crop.profitPotential,
    };
  });

  return results.sort((a, b) => b.suitablePercent - a.suitablePercent).slice(0, 6);
};

export const checkCropCompatibility = ({ cropName, soilLevels, ph, waterSource }) => {
  const crop = CROP_DB.find((c) => c.name.toLowerCase() === cropName.toLowerCase());
  if (!crop) return null;

  let score = 0;
  score += levelMatch(crop.n, soilLevels.nitrogen) * 25;
  score += levelMatch(crop.p, soilLevels.phosphorus) * 20;
  score += levelMatch(crop.k, soilLevels.potassium) * 20;
  score += (ph >= crop.idealPh[0] && ph <= crop.idealPh[1] ? 1 : 0.4) * 15;
  score += waterMatch(crop.waterNeed, waterSource) * 20;

  const suitablePercent = Math.round(Math.min(100, score));
  return {
    crop: crop.name,
    suitablePercent,
    riskLevel: suitablePercent >= 75 ? "Low" : suitablePercent >= 55 ? "Medium" : "High",
    waterNeed: crop.waterNeed,
    profitPotential: crop.profitPotential,
  };
};
