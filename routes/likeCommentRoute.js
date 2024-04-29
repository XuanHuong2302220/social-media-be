import express from "express";
import {
  createLike,
  getLikes,
  updateLike,
  deleteLike,
} from "../controller/likeCommentController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/:postId/comment/:commentId/", protectRoute, createLike);
router.get("/:postId/comment/:commentId/like", protectRoute, getLikes);
router.put("/:postId/comment/:commentId/update/:id", protectRoute, updateLike);
router.delete(
  "/:postId/comment/:commentId/delete/:id",
  protectRoute,
  deleteLike
);

export default router;
