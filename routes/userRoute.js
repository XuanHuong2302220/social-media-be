import express from "express";
import {
  getUsers,
  getUser,
  updateNameUser,
  updatePassword,
  updatePicture,
  updateGender,
  updateBirthday,
} from "../controller/userController.js";
import protectRoute from "./../middleware/protectRoute.js";

const router = express.Router();

router.get("/search", protectRoute, getUsers);
router.get("/profile/:id", protectRoute, getUser);
router.put("/profile/name", protectRoute, updateNameUser);
router.put("/profile/password", protectRoute, updatePassword);
router.put("/profile/picture", protectRoute, updatePicture);
router.put("/profile/gender", protectRoute, updateGender);
router.put("/profile/birthday", protectRoute, updateBirthday);

export default router;
