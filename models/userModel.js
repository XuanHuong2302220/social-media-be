import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
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
      default: "../assets/avatarDefault.jpg",
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
