// routers/assistant.js
import { Router } from "express";
import { assistantController } from "../controllers/assistantController.js";

const app = Router();

// AI assistant routes
app.post("/", assistantController.getAssistantResponse);
app.post("/chat", assistantController.getUserChat);

export default app;