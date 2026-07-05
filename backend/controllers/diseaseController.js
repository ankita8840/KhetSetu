import multer from "multer";
import DiseaseDetection from "../models/DiseaseDetection.js";
import { detectDisease } from "../utils/diseaseDetectionEngine.js";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// @route POST /api/disease/detect
export const detectLeafDisease = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Leaf image is required" });

    const result = detectDisease(req.file.originalname);

    const entry = await DiseaseDetection.create({
      user: req.user._id,
      imageName: req.file.originalname,
      ...result,
    });

    res.status(201).json({ entry, demo: true });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/disease/history
export const getDiseaseHistory = async (req, res, next) => {
  try {
    const entries = await DiseaseDetection.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ entries });
  } catch (error) {
    next(error);
  }
};
