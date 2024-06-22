import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  createLike,
  getLikes,
  deleteLike,
} from "../controller/likePostController.js";
const router = express.Router();

router.post("/:postId/like", protectRoute, createLike);

router.get("/:postId/like", protectRoute, getLikes);

router.delete("/:postId/like", protectRoute, deleteLike);

export default router;
