import express from "express";
import { getSchemes } from "../controllers/schemesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSchemes);

export default router;
