import express from "express";
import protectRoute from "./../../middleware/protectRoute.js";
import {
  createConversation,
  getConversations,
  getConversation,
  deleteConversation,
} from "../../controller/chat/conversationController.js";

const router = express.Router();

router.get("/", protectRoute, getConversations);
router.get("/:id", protectRoute, getConversation);
router.post("/:userId", protectRoute, createConversation);
router.delete("/:id", protectRoute, deleteConversation);

export default router;
