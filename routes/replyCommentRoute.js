import express from "express";
import protectRoute from "./../middleware/protectRoute.js";
import {
  createReplyComment,
  getReplyComments,
  updateReplyComment,
  deleteReplyComment,
} from "../controller/replyCommentController.js";

const router = express.Router();

router.post(
  "/:postId/comment/:commentId/reply",
  protectRoute,
  createReplyComment
);
router.get("/:postId/comment/:commentId/reply", protectRoute, getReplyComments);
router.put(
  "/:postId/comment/:commentId/reply/:id",
  protectRoute,
  updateReplyComment
);
router.delete(
  "/:postId/comment/:commentId/reply/:id",
  protectRoute,
  deleteReplyComment
);

export default router;
