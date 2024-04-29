import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  createFollow,
  getFollowings,
  getFollowers,
  deleteFollowing,
  deleteFollower,
} from "../controller/followController.js";

const router = express.Router();

router.post("/:id", protectRoute, createFollow);
router.get("/:id/following", protectRoute, getFollowings);
router.get("/:id/follower", protectRoute, getFollowers);
router.delete("/:id/following", protectRoute, deleteFollowing);
router.delete("/:id/follower", protectRoute, deleteFollower);

export default router;
