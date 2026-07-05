import express from "express";
import { getBookings, createBooking, updateBookingStatus } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBookings);
router.post("/", protect, createBooking);
router.put("/:id", protect, updateBookingStatus);

export default router;
