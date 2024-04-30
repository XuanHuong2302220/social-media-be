import express from "express";
import { getUsers, getUser, updateUser } from "../controller/userController.js";
import protectRoute from "./../middleware/protectRoute.js";

const router = express.Router();

router.get("/search", protectRoute, getUsers);
router.get("/profile/:id", protectRoute, getUser);
router.put("/profile/:id", protectRoute, updateUser);

export default router;
