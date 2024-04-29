import express from "express";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../../controller/chat/messageController.js";
import protectRoute from "./../../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/:id", protectRoute, sendMessage);
router.delete("/:userId/delete/:id", protectRoute, deleteMessage);

export default router;
