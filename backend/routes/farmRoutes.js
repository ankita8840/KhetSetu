import express from "express";
import { getFarm, upsertFarm } from "../controllers/farmController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getFarm);
router.put("/", protect, upsertFarm);

export default router;
