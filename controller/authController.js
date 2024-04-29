import generateToken from "../jwt/generateToken.js";
import Follow from "../models/followModel.js";
import NotifyBox from "../models/notifyBoxModel.js";
import User from "./../models/userModel.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, password, confirmPassword, fullName, gender, birthday } =
      req.body;
    if (password !== confirmPassword)
      res.status(400).json("password don't match");
    const user = await User.findOne({ username });
    if (user) res.status(400).json("username already exist");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const birthdatDate = new Date(birthday);

    const newUser = await User.create({
      username: username,
      fullName: fullName,
      password: hashedPassword,
      gender: gender,
      birthday: birthdatDate,
    });

    if (newUser) {
      await generateToken({ userID: newUser._id }, res);
      await Follow.create({
        authorId: newUser._id,
        followingId: [],
        followerId: [],
      });

      await NotifyBox.create({
        authorId: newUser._id,
        notifyId: [],
      });

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        gender: newUser.gender,
        birthday: newUser.birthday,
      });
    }
  } catch (error) {
    console.log("Error in sign up Controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isHashedPassword = await bcryptjs.compare(
      password,
      user?.password || ""
    );
    if (!user || !isHashedPassword)
      return res.status(401).json("invalid username or password");

    await generateToken({ userID: user._id }, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullName,
      username: user.username,
      gender: user.gender,
      birthday: user.birthday,
    });
  } catch (error) {
    console.log("Error in sign up Controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const check = await res.clearCookie("jwtToken");
    if (check) res.status(200).json("Logged out successfully");
  } catch (error) {
    console.log("Error in log out Controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
