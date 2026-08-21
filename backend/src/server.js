import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import issueRoutes from "./routes/issues.js";
import memberRoutes from "./routes/members.js";
import dashboardRoutes from "./routes/dashboard.js";


dotenv.config();


const app = express();


// Middleware

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


app.use(
    express.json()
);



// Health check

app.get(
    "/api/health",
    (req, res) => {

        res.json({
            success: true,
            message: "TrackLite API is running"
        });

    }
);



// API Routes

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/projects",
    projectRoutes
);


app.use(
    "/api/issues",
    issueRoutes
);


app.use(
    "/api/members",
    memberRoutes
);


app.use(
    "/api/dashboard",
    dashboardRoutes
);



// 404 handler

app.use(
    (req, res) => {

        res.status(404).json({

            message: "API endpoint not found"

        });

    }
);



// Error handler

app.use(
    (error, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            error
        );


        res.status(500).json({

            message: "Internal server error"

        });

    }
);



// Start server

const PORT =
process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `TrackLite API running on port ${PORT}`
        );

    }
);