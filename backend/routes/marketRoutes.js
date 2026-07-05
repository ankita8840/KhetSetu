import express from "express";
import { getPrices, getPrediction } from "../controllers/marketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/prices", protect, getPrices);
router.get("/predict", protect, getPrediction);

export default router;
