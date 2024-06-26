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
  },
  {
    timestamps: true,
  }
);

const LikePost = mongoose.model("LikePost", likePost);
export default LikePost;
