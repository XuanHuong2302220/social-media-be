import express from "express";
import {
  getNotifications,
  deleteNotification,
} from "../controller/notificationController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
