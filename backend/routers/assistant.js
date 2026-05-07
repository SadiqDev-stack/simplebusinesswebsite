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

export default app;