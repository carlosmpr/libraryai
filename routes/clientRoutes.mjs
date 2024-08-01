import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ensureAuthenticated } from "./middleware/authMiddleware.mjs";

const router = express.Router();

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to send index.html for all routes
const sendIndexHtml = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
};

// Routes that do not require authentication
router.get("/", sendIndexHtml);
router.get("/features", sendIndexHtml);
router.get("/about", sendIndexHtml);
router.get("/privacy", sendIndexHtml);

// Middleware to ensure authentication for routes that require it
router.use(ensureAuthenticated);

// Routes that require authentication
router.get("/library", sendIndexHtml);
router.get("/library/:repoName", sendIndexHtml);
router.get("/customizeprompt", sendIndexHtml);
router.get("/userPrompts", sendIndexHtml);

export default router;
