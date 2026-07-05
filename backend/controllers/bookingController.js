import Booking from "../models/Booking.js";

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { expertName, preferredDate, notes } = req.body;
    if (!expertName || !preferredDate) {
      return res.status(400).json({ message: "expertName and preferredDate are required" });
    }
    const booking = await Booking.create({ user: req.user._id, expertName, preferredDate, notes });
    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ booking });
  } catch (error) {
    next(error);
  }
};
