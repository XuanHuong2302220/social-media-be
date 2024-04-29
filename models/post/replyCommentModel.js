import mongoose from "mongoose";

const replyComment = mongoose.Schema({
  userReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likeReply: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LikeReply",
    },
  ],
});

const ReplyComment = mongoose.model("ReplyComment", replyComment);
export default ReplyComment;
