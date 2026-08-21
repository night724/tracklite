import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import issueRoutes from "./routes/issues.js";
import memberRoutes from "./routes/members.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "TrackLite API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/members", memberRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`TrackLite API running on port ${PORT}`);
});
