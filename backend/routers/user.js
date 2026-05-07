// routers/user.js
import { Router } from "express";
import { userController } from "../controllers/userController.js";
import authenticate from "../middlewares/authentication.js";
import authorize from "../middlewares/authorization.js";

const app = Router();

// Public routes
app.post("/register", userController.register);
app.get("/verify", userController.verify);
app.post("/authenticate", authenticate, userController.authenticate);
app.post("/reset/:type", userController.resetPassword);
app.post("/logout", userController.logout);
app.get("/admin/authorize/:token", userController.adminAuthorize);

// Protected routes (require authorization)
app.get("/profile", authorize, userController.getProfile);
app.get("/info", authorize, userController.getUserInfo);
app.put("/setting", authorize, userController.updateSettings);

export default app;