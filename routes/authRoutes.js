import express from "express";
import {
  login,
  signup,
  logout,
  verifyEmail,
  forgotPassword,
} from "../controller/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/:id/verify/:token/", verifyEmail);
router.post("/forgot-password", forgotPassword);

export default router;
