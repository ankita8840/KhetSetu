import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import soilRoutes from "./routes/soilRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import schemesRoutes from "./routes/schemesRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "KhetSetu API" }));

app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/schemes", schemesRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KhetSetu API running on port ${PORT}`));
