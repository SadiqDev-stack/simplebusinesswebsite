import { Router } from "express";
import { log } from "../middlewares/logger.js";
const app = Router();

app.post("/", async (req, res, next) => {
  try {
    const apiKeys = {};
    const userPrompt = req.body.message || false;

    if (!userPrompt || typeof userPrompt !== "string")
      throw new req.AppError("invalid user message!");

    if (!req.config.assistant)
      throw new req.AppError(
        "assistant service temporarily unavailable please try again later!",
      );

    try {
      Assistant.getResponse(
        req,
        [
          {
            role: "user",
            content: userPrompt,
          },
        ],
        async (success, response) => {
          if (typeof response !== "string")
            return res.json({
              success: false,
              message: "something went wrong, try again! ",
            });

          try {
            response = JSON.parse(response);
          } catch (er) {
            throw new req.AppError("something went wrong, try again!");
          }

          const { message, supportMail } = response;

          res.json({
            success,
            message,
          });
        },
      );
    } catch (er) {
      req.err = er;
      next();
    }
  } catch (er) {
    req.err = er;
    next();
  }
});

export default app;
