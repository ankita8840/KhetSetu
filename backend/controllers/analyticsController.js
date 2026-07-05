import SoilData from "../models/SoilData.js";
import DiseaseDetection from "../models/DiseaseDetection.js";
import Transaction from "../models/Transaction.js";

// @route GET /api/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const soilEntries = await SoilData.find({ user: userId }).sort({ createdAt: 1 });
    const diseaseEntries = await DiseaseDetection.find({ user: userId });
    const transactions = await Transaction.find({ user: userId }).sort({ date: 1 });

    const soilTrend = soilEntries.map((s) => ({
      date: s.createdAt.toISOString().slice(0, 10),
      score: s.analysis.soilHealthScore,
    }));

    const diseaseCounts = {};
    diseaseEntries.forEach((d) => {
      diseaseCounts[d.diseaseName] = (diseaseCounts[d.diseaseName] || 0) + 1;
    });

    const expenseByCategory = {};
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((t) => {
      if (t.type === "expense") {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      } else {
        totalIncome += t.amount;
      }
    });

    res.json({
      soilTrend,
      diseaseCounts,
      expenseByCategory,
      profit: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      soilEntryCount: soilEntries.length,
      diseaseDetectionCount: diseaseEntries.length,
    });
  } catch (error) {
    next(error);
  }
};
