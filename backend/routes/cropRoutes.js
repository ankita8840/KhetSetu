import express from "express";
import { getCropRecommendations, getCropCompatibility } from "../controllers/cropController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recommend", protect, getCropRecommendations);
router.post("/compatibility", protect, getCropCompatibility);

export default router;
