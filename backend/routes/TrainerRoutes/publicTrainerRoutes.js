import express from "express";
import { db } from "../../db.js";
import { requireAuth } from "../../middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

export default router;
