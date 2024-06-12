import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    bio: {
      type: String,
      default: "Hey there! I'm using ChatChat",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    gender: {
      type: String,
      require: true,
      enum: ["male", "female"],
    },
    profilePicture: {
      type: String,
    },
    birthday: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", user);

export default User;
