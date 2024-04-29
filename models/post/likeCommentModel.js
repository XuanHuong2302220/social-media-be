import mongoose from "mongoose";

const likeComment = mongoose.Schema(
  {
    userLike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    commentLike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
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

const LikeComment = mongoose.model("LikeComment", likeComment);
export default LikeComment;
