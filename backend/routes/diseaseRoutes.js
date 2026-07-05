import express from "express";
import { upload, detectLeafDisease, getDiseaseHistory } from "../controllers/diseaseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/detect", protect, upload.single("image"), detectLeafDisease);
router.get("/history", protect, getDiseaseHistory);

export default router;
