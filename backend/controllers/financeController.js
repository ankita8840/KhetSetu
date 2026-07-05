import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, description, date } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ message: "type and amount are required" });
    }
    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date,
    });
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/finance/summary
export const getFinanceSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const profit = totalIncome - totalExpense;
    const roi = totalExpense > 0 ? Math.round((profit / totalExpense) * 100) : 0;

    const expenseByCategory = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    res.json({ totalIncome, totalExpense, profit, roi, expenseByCategory });
  } catch (error) {
    next(error);
  }
};
