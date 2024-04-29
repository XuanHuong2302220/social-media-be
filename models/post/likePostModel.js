import mongoose from "mongoose";

const likePost = mongoose.Schema(
  {
    userLike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    postLike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    typeLike: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
    },
  },
  {
    timestamps: true,
  }
);

const LikePost = mongoose.model("LikePost", likePost);
export default LikePost;
