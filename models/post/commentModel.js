import mongoose from "mongoose";

const comments = mongoose.Schema(
  {
    postComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      require: true,
    },
    likeComment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LikeComment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", comments);

export default Comment;
