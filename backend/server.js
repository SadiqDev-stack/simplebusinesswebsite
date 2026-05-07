import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { templates } from "./services/mail.js";
import { DB_URI, dbHandler } from "./middlewares/dbhandler.js";
import errorHandler from "./middlewares/error.js";
import { logger, log } from "./middlewares/logger.js";

import { useLimiter } from "./utilities/general.js";

import userRouter from "./routers/user.js";
import contactRouter from "./routers/contact.js";
import assistantRouter from "./routers/assistant.js";

const app = express();

const {
  PORT = 8080,
  NODE_ENV = "development",
} = process.env;


const FRONTEND_URL = NODE_ENV == "development" ?
process.env.FRONTEND_URL : FRONTEND_LIVE_URI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.set("bufferCommands", false);

// ======================
// Middlewares
// ======================

app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(logger);

// ======================
// Auto auth redirect
// ======================

app.use((req, res, next) => {
  const { token = false } = req.cookies;

  const isAuthPage = req.url === "/auth.html";
  const isDashboardPage = req.path.includes("/dashboard/");

  if (token && isAuthPage) {
    return res.redirect("/user/dashboard.html");
  }

  if (!token && isDashboardPage) {
    return res.redirect("/auth.html");
  }

  next();
});


// React SPA routing
app.get("/", (req, res) => {
  res.json({
    message: "server is alive and running successfully"
  })
});

// ======================
// API Routes
// ======================

app.use("/api/user", dbHandler, userRouter);
app.use("/api/contact", dbHandler, contactRouter);
app.use("/api/assistant", dbHandler, assistantRouter);

// ======================
// Message Route
// ======================

app.get("/message", (req, res, next) => {
  try {
    res.send(templates.message({ ...req.query, req }));
  } catch (err) {
    next(err);
  }
});

// ======================
// Error Handler
// ======================

app.use(errorHandler);

// ======================
// Database Connection
// ======================

mongoose
  .connect(DB_URI)
  .then(() => {
    log("MongoDB connected");

    // only listen locally
    if (NODE_ENV !== "production") {
      app.listen(PORT, () => {
        log(`Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

export default app;