import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getPosts,
  createPost,
  getPost,
  editPost,
  deletePost,
  getPostHome,
} from "../controller/postController.js";
const router = express.Router();

router.get("/:userId", protectRoute, getPosts);
router.get("/post/:id", protectRoute, getPost);
router.post("/", protectRoute, createPost);
router.put("/:id", protectRoute, editPost);
router.delete("/:id", protectRoute, deletePost);
router.get("/", protectRoute, getPostHome);

export default router;
