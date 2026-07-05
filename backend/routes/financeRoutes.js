import express from "express";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getFinanceSummary,
} from "../controllers/financeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTransactions);
router.post("/", protect, createTransaction);
router.delete("/:id", protect, deleteTransaction);
router.get("/summary", protect, getFinanceSummary);

export default router;
