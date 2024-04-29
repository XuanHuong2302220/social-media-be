import mongoose from "mongoose";

const posts = mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
      required: true,
    },
    likePostId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LikePost",
      },
    ],
    commentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", posts);
export default Post;
