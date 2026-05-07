// routers/assistant.js
import { Router } from "express";
import { log } from "../middlewares/logger.js";
import Assistant from "../services/assistant.js";

const app = Router();

app.post("/", async (req, res, next) => {
  try {
    const { message: userPrompt, contactData } = req.body;

    if (!userPrompt || typeof userPrompt !== "string") {
      throw new req.AppError("invalid user message!");
    }

    const prompt = `User message: ${userPrompt}\nContact info: ${JSON.stringify(contactData || {})}`;

    Assistant.getResponse(
      req,
      Assistant.aiContexts.assistance(),
      [{ role: "user", content: prompt }],
      (success, response) => {
        if (!success) {
          return res.json({
            success: false,
            message: "Sorry, I couldn't process that. Please try again."
          });
        }

        // Just return the plain text response directly
        res.json({
          success: true,
          message: response
        });
      }
    );
  } catch (error) {
    log(error);
    req.err = error;
    next();
  }
});


app.post("/chat", async (req, res, next) => {
  try {
    const { message, userId, userName } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const prompt = `
User: ${userName || "Customer"}
Message: ${message}

Please provide a helpful response about Sadiq Caps products, orders, or support.
`;

    Assistant.getResponse(
      req,
      Assistant.aiContexts.userChatContext(),
      [{ role: "user", content: prompt }],
      (success, response) => {
        if (!success) {
          return res.json({
            success: false,
            message: "Sorry, I'm having trouble. Please try again."
          });
        }

        res.json({
          success: true,
          message: response
        });
      }
    );
  } catch (error) {
    log(error);
    req.err = error;
    next();
  }
});

export default app;