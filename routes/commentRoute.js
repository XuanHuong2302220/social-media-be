import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  sendComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
} from "../controller/commentController.js";

const router = express.Router();

router.post("/:postId/comment/send", protectRoute, sendComment);
router.get("/:postId/comment", protectRoute, getComments);
router.get("/:postId/comment/:id", protectRoute, getComment);
router.put("/:postId/comment/:id", protectRoute, updateComment);
router.delete("/:postId/comment/:id", protectRoute, deleteComment);

export default router;
