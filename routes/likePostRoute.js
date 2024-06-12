import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  createLike,
  getLikes,
  getLike,
  deleteLike,
} from "../controller/likePostController.js";
const router = express.Router();

router.post("/:postId/like", protectRoute, createLike);

router.get("/:postId/like", protectRoute, getLikes);

router.get("/:postId/like/:id", protectRoute, getLike);

router.delete("/:postId/like/:id", protectRoute, deleteLike);

export default router;
