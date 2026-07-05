/**
 * Government Schemes Engine
 * Static reference data on major central schemes with simple rule-based
 * eligibility matching against the farmer's profile (land area, water source).
 */

export const SCHEMES_DB = [
  {
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000/year to landholding farmer families, paid in 3 installments.",
    eligibility: (farm) => true,
  },
  {
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme protecting farmers against crop loss from natural calamities.",
    eligibility: (farm) => (farm?.landAreaAcres || 0) > 0,
  },
  {
    name: "KCC",
    fullName: "Kisan Credit Card",
    description: "Easy access to credit for crop production, post-harvest expenses and farm investment.",
    eligibility: (farm) => (farm?.landAreaAcres || 0) > 0,
  },
  {
    name: "Soil Health Card",
    fullName: "Soil Health Card Scheme",
    description: "Free soil testing every 2 years with crop-wise nutrient and fertilizer recommendations.",
    eligibility: (farm) => true,
  },
  {
    name: "FPO Scheme",
    fullName: "Formation and Promotion of FPOs",
    description: "Support for Farmer Producer Organizations to improve bargaining power and market access.",
    eligibility: (farm) => (farm?.landAreaAcres || 0) <= 5,
  },
];

export const recommendSchemes = (farm) => {
  return SCHEMES_DB.map((scheme) => ({
    name: scheme.name,
    fullName: scheme.fullName,
    description: scheme.description,
    eligible: scheme.eligibility(farm),
  }));
};
