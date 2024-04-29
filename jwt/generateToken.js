import jwt from "jsonwebtoken";

const generateToken = async ({ userID }, res) => {
  const token = jwt.sign({ userID }, process.env.SECRET_KEY, {
    expiresIn: "15d",
  });

  return res.cookie("jwtToken", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.ENV !== "development",
  });
};

export default generateToken;
