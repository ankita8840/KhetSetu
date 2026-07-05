import express from "express";
import { addSoilData, getSoilHistory, getLatestSoilData } from "../controllers/soilController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addSoilData);
router.get("/", protect, getSoilHistory);
router.get("/latest", protect, getLatestSoilData);

export default router;
