import express from "express";
import adminAuthRoutes from "./public/adminAuthRoutes.js";
import userAuthRoutes from "./public/userAuthRoutes.js";
import verificationRoutes from "./public/verificationRoutes.js";
import passwordRoutes from "./public/passwordRoutes.js";

const router = express.Router();

router.use(adminAuthRoutes);
router.use(userAuthRoutes);
router.use(verificationRoutes);
router.use(passwordRoutes);

export default router;
