// routers/contact.js
import { Router } from "express";
import { contactController } from "../controllers/contactController.js";
import authorize from "../middlewares/authorization.js";

const app = Router();

// Public route - submit support ticket
app.post("/support", contactController.submitSupport);

// All routes below require authentication
app.use(authorize);

// Contact management routes
app.get("/history", contactController.getHistory);
app.get("/contact/:id", contactController.getContactById);
app.put("/see", contactController.markAsSeen);
app.put("/see-all", contactController.markAllAsSeen);
app.delete("/old", contactController.deleteOldContacts);

export default app;