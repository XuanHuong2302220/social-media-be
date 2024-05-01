import generateToken from "../jwt/generateToken.js";
import Follow from "../models/followModel.js";
import NotifyBox from "../models/notifyBoxModel.js";
import Token from "../models/tokenModel.js";
import User from "./../models/userModel.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import sendVerify from "./../utils/sendVerify.js";

export const signup = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      confirmPassword,
      fullName,
      gender,
      birthday,
    } = req.body;

    if (
      !username ||
      !password ||
      !email ||
      !confirmPassword ||
      !fullName ||
      !gender ||
      !birthday
    ) {
      return res.status(400).json("All fields are required");
    }

    if (password !== confirmPassword)
      res.status(400).json("password don't match");
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (user) res.status(400).json("username or email already exist");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const birthdatDate = new Date(birthday);

    const newUser = await User.create({
      username: username,
      fullName: fullName,
      email: email,
      password: hashedPassword,
      gender: gender,
      birthday: birthdatDate,
    });

    if (newUser) {
      const token = await Token.create({
        userId: newUser._id,
        token: crypto.randomBytes(32).toString("hex"),
      });

      const url = `${process.env.BASE_URL}/users/${newUser.id}/verify/${token.token}`;
      await sendVerify(email, url);

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

      res
        .status(201)
        .send({ message: "An Email sent to your account please verify" });
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

    if (!user.isVerified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendVerify(user.email, "Verify Your Email ", url);
      }

      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }

    await generateToken({ userID: user._id }, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullName,
      username: user.username,
      gender: user.gender,
      birthday: user.birthday,
    });
  } catch (error) {
    console.log("Error in login Controller", error.message);
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

export const verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const tokenVerify = await Token.findOne({
      userId: user._id,
      token: token,
    });
    if (!tokenVerify) return res.status(400).send({ message: "Invalid link" });

    await User.findByIdAndUpdate({ _id: user._id }, { isVerified: true });
    await Token.deleteOne({ token: token });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error in verify email Controller", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!email) return res.status(400).json("Email is required");

    if (!user) return res.status(400).json("User not found");

    const newPassword = crypto.randomBytes(4).toString("hex");

    await sendVerify(email, "New Password", newPassword);

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    await User.updateOne({ email: email }, { password: hashedPassword });

    res.status(200).json("New password sent to your email");
  } catch (error) {
    console.log("Error in forgot password Controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
