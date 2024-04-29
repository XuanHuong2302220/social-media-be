import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = await req.cookies.jwtToken;

    if (!token) return res.status(400).json("UnAuthorized, No token provide");
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) return res.status(400).json("UnAuthorized, Invalid Token");

    const user = await User.findById(decode.userID).select("-password");

    if (!user) res.status(400).json("User not found");

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute", error.message);
    res.status(500).json("Internal server error");
  }
};

export default protectRoute;
