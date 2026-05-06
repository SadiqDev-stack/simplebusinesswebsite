import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import { templates } from "./services/mail.js";
import cookieParser from "cookie-parser"
import { dbHandler } from "./middlewares/dbhandler.js";
import errorHandler from "./middlewares/error.js"

const app = express();
const { PORT = 8080, DB_URI } = process.env;
import { logger, log } from "./middlewares/logger.js";
import {  useLimiter } from "./utilities/general.js";
import path from "path";
import userRouter from "./routers/user.js";
import contactRouter from "./routers/contact.js";
import assistantRouter from "./routers/assistant.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



mongoose.set("bufferCommands", false);

// middlewares 
app.use(cookieParser())
app.use(express.json());
app.use(cors())
app.use(logger)

app.get("/", useLimiter("2m", 200));
app.use("/api/user", useLimiter("1m", 100));
app.use("/api/contact", useLimiter("1m", 100))
app.use("/api/assistant", useLimiter("1m", 30));


// auto login if token exist
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


// 1. Serve static files from the build/dist folder
app.use(express.static(path.join(__dirname, '../frontend/dist'))); 

// This ensures that refreshing the page doesn't give a 404 handle spas routing for react and other frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// routers 
app.use("/api/user", dbHandler, userRouter);
app.use("/api/contact", dbHandler, contactRouter);
app.use("/api/assistant", dbHandler, assistantRouter)



// for message plain and redirect 
app.get("/message", (req, res, next) => {
  try {
    res.send(templates.message({ ...req.query, req }))
  } catch (er) {
    next()
  }
})


// for route errors
app.use("/", (req, res, next) => {
  const isApi = req.path.startsWith("/api");
  const isFile = req.path.includes(".");
  const pageFound = webPages.find(page => req.path.startsWith(page));
  
  
  if (!isApi && !isFile && pageFound) {
    return res.redirect(`${req.domain}${req.path}.html`)
  }
  next();
});

// API error and not found handler
app.use(errorHandler);


// server starting
const startServer = () => {
  app.listen(PORT, () => {
    log(`server started at http://localhost:${PORT}`)
  })
}

startServer();

export default app