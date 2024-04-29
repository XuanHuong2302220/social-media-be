import Notification from "../models/notificationModel.js";
import Comment from "../models/post/commentModel.js";
import LikeComment from "../models/post/likeCommentModel.js";
import Post from "../models/post/postModel.js";
import NotifyBox from "./../models/notifyBoxModel.js";

export const sendComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });

    if (!content)
      return res.status(400).json({ message: "Content don't be empty" });

    const newComment = await Comment.create({
      postComment: postId,
      senderId: userId,
      receiverId: post.authorId,
      content,
    });

    if (newComment) {
      await post.commentId.push(newComment._id);
      await post.save();
    }

    if (userId.toString() === post.authorId.toString()) {
      return res
        .status(400)
        .json({ message: "You can like, but don't notify" });
    }

    const noti = await Notification.create({
      senderId: userId,
      receiverId: post.authorId,
      notiType: "comment",
      notiText: `${req.user.fullName} commented on your post`,
    });

    const notifyBox = await NotifyBox.findOne({ authorId: post.authorId });
    if (!notifyBox) {
      res.status(400).json({ message: "NotifyBox not found" });
    }
    if (!notifyBox.notifyId.includes(noti._id)) {
      await NotifyBox.findOneAndUpdate(
        {
          authorId: post.authorId,
        },
        {
          $push: { notifyId: noti._id },
        }
      );
    }
    return res.status(201).json({ message: "Comment created", newComment });
  } catch (error) {
    console.log("error in sendComment", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });

    const comments = await Comment.findById(post.commentId);

    if (!comments)
      return res.status(400).json({ message: "Not comment created yet" });

    return res.status(200).json({
      message: "All comments",
      comments: comments,
    });
  } catch (error) {
    console.log("error in getComments", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getComment = async (req, res) => {
  try {
    const { postId, id } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(400).json({ message: "Comment not found" });

    return res.status(200).json({
      message: "Comment",
      comment: comment,
    });
  } catch (error) {
    console.log("error in getComment", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateComment = async (req, res) => {
  try {
    const { postId, id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content)
      return res.status(400).json({ message: "Content don't be empty" });
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });
    const comment = await Comment.findById(id);

    console.log(comment);

    if (!comment) return res.status(400).json({ message: "Comment not found" });

    if (!comment.senderId.equals(userId))
      return res.status(401).json({ message: "You can't update this comment" });

    const newComment = await Comment.findByIdAndUpdate(
      id,
      { content: content },
      { new: true }
    );
    if (newComment) {
      return res.status(200).json({
        message: "updated Comment successfully",
        newComment: newComment,
      });
    }
  } catch (error) {
    console.log("error in updateComment", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { postId, id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });
    const comment = await Comment.findById(id);
    if (!comment) return res.status(400).json({ message: "Comment not found" });

    if (!comment.senderId.equals(userId))
      return res.status(401).json({ message: "You can't delete this comment" });

    const deleteComment = await Comment.findByIdAndDelete(id);

    if (deleteComment) {
      await post.commentId.pull(id);
      await post.save();
      await LikeComment.findOneAndDelete({ commentLike: id });
    }

    if (deleteComment) {
      return res.status(200).json({ message: "Comment deleted successfully" });
    }
  } catch (error) {
    console.log("error in deleteComment", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
