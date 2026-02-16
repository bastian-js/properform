import express from "express";

import { upload } from "../../functions/multerMedia.js";

import { requireRole } from "../../middleware/role.js";
import { createRateLimiter } from "../../middleware/rate.js";

import { requireAuth } from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  requireAuth,
  requireRole("owner"),
  createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 }),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded or unsupported file type.",
        });
      }

      const folder = req.file.mimetype.startsWith("image/")
        ? "images"
        : "videos";

      const url =
        "https://media.properform.app/" + folder + "/" + req.file.filename;

      res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        url,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error uploading file",
        error: err.message,
      });
    }
  },
);

export default router;
