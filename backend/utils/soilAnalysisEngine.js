/**
 * Rule-based Soil Analysis Engine
 * Uses standard Indian agricultural soil testing thresholds (ICAR reference ranges)
 * to compute a soil health score, grade, fertility status and fertilizer advice.
 *
 * NOTE: This is a deterministic rule engine, not a trained ML model.
 * It is structured so a future ML model (e.g. a Python microservice) can be
 * swapped in by replacing the body of `analyzeSoil` while keeping the same
 * input/output contract.
 */

const rate = (value, low, high) => {
  if (value < low) return "Low";
  if (value > high) return "High";
  return "Medium";
};

export const analyzeSoil = ({ nitrogen, phosphorus, potassium, ph, moisture, organicCarbon }) => {
  const nLevel = rate(nitrogen, 280, 560); // kg/ha
  const pLevel = rate(phosphorus, 10, 25); // kg/ha
  const kLevel = rate(potassium, 110, 280); // kg/ha
  const ocLevel = rate(organicCarbon, 0.5, 0.75); // %

  let phStatus = "Neutral";
  if (ph < 5.5) phStatus = "Strongly Acidic";
  else if (ph < 6.5) phStatus = "Slightly Acidic";
  else if (ph <= 7.5) phStatus = "Neutral";
  else if (ph <= 8.5) phStatus = "Slightly Alkaline";
  else phStatus = "Strongly Alkaline";

  // --- Score each parameter out of its weight, total = 100 ---
  const levelScore = (level, weight) => {
    if (level === "Medium") return weight;
    if (level === "High") return weight * 0.8;
    return weight * 0.4; // Low
  };

  let score = 0;
  score += levelScore(nLevel, 20);
  score += levelScore(pLevel, 20);
  score += levelScore(kLevel, 20);
  score += levelScore(ocLevel, 15);
  score += phStatus === "Neutral" ? 15 : phStatus.includes("Slightly") ? 9 : 4;
  score += moisture >= 20 && moisture <= 45 ? 10 : moisture > 0 ? 6 : 0;

  score = Math.round(Math.min(100, Math.max(0, score)));

  let soilGrade = "D";
  if (score >= 85) soilGrade = "A";
  else if (score >= 70) soilGrade = "B";
  else if (score >= 50) soilGrade = "C";

  const fertilityStatus = score >= 70 ? "Good" : score >= 50 ? "Moderate" : "Poor";
  const waterRetention = moisture >= 35 ? "High" : moisture >= 18 ? "Moderate" : "Low";

  const deficiencies = [];
  if (nLevel === "Low") deficiencies.push("Nitrogen (N)");
  if (pLevel === "Low") deficiencies.push("Phosphorus (P)");
  if (kLevel === "Low") deficiencies.push("Potassium (K)");
  if (ocLevel === "Low") deficiencies.push("Organic Carbon");
  if (phStatus !== "Neutral") deficiencies.push(`pH Imbalance (${phStatus})`);

  const fertilizerRecommendation = [];
  if (nLevel === "Low") {
    fertilizerRecommendation.push({
      name: "Urea",
      reason: "Nitrogen level is low; Urea (46% N) will boost vegetative growth.",
    });
  }
  if (pLevel === "Low") {
    fertilizerRecommendation.push({
      name: "DAP (Di-Ammonium Phosphate)",
      reason: "Phosphorus is deficient; DAP supports root development and flowering.",
    });
  }
  if (kLevel === "Low") {
    fertilizerRecommendation.push({
      name: "Potash (MOP)",
      reason: "Potassium is low; Potash improves disease resistance and fruit quality.",
    });
  }
  if (ocLevel === "Low") {
    fertilizerRecommendation.push({
      name: "Organic Fertilizer / FYM Compost",
      reason: "Organic carbon is low; well-rotted compost improves long-term soil structure.",
    });
  }
  if (fertilizerRecommendation.length === 0) {
    fertilizerRecommendation.push({
      name: "Maintenance Dose (Balanced NPK)",
      reason: "Soil nutrients are in a healthy range; apply a light balanced dose to maintain levels.",
    });
  }

  return {
    soilHealthScore: score,
    soilGrade,
    fertilityStatus,
    waterRetention,
    deficiencies,
    fertilizerRecommendation,
    levels: { nitrogen: nLevel, phosphorus: pLevel, potassium: kLevel, organicCarbon: ocLevel, ph: phStatus },
  };
};
