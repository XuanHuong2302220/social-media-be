import Post from "../models/post/postModel.js";
import ReplyComment from "./../models/post/replyCommentModel.js";
import NotifyBox from "../models/notifyBoxModel.js";
import Comment from "../models/post/commentModel.js";
import Notification from "../models/notificationModel.js";

export const createReplyComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Content don't be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.commentId.includes(commentId)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await Comment.findById(commentId);

    const newReplyComment = await ReplyComment.create({
      userReply: userId,
      commentReply: commentId,
      content,
    });

    if (newReplyComment) {
      comment.replyComment.push(newReplyComment._id);
      await comment.save();

      if (!userId.toString() === comment.senderId.toString()) {
        const notify = await Notification.create({
          senderId: userId,
          receiverId: comment.senderId,
          notiType: "replyComment",
          notiText: `${req.user.fullName} replied to your comment`,
        });

        const notifyBox = await NotifyBox.findOne({
          authorId: comment.senderId,
        });

        if (notifyBox) {
          notifyBox.notifyId.push(notify._id);
          await notifyBox.save();
        } else {
          await NotifyBox.create({
            authorId: comment.senderId,
            notifyId: [notify._id],
          });
        }
      }
    }
    return res.status(201).json({
      newReplyComment: newReplyComment,
    });
  } catch (error) {
    console.log("Error in createReplyComment", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReplyComments = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.commentId.includes(commentId)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const replyComments = await ReplyComment.find({ commentReply: commentId });

    return res.status(200).json({ replyComments });
  } catch (error) {
    console.log("Error in getReplyComments", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReplyComment = async (req, res) => {
  try {
    const { postId, commentId, id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Content don't be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.commentId.includes(commentId)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const replyComment = await ReplyComment.findById(id);
    if (!replyComment) {
      return res.status(404).json({ message: "Reply comment not found" });
    }

    if (replyComment.userReply.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can't update this reply comment" });
    }

    const newReplyComment = await ReplyComment.findByIdAndUpdate(
      { _id: replyComment._id },
      {
        content,
      },
      { new: true }
    );

    if (newReplyComment) {
      return res.status(200).json({
        message: "Reply comment updated successfully",
        newReplyComment: newReplyComment,
      });
    }
  } catch (error) {
    console.log("Error in updateReplyComment", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReplyComment = async (req, res) => {
  try {
    const { postId, commentId, id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.commentId.includes(commentId)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const replyComment = await ReplyComment.findById(id);

    if (!replyComment) {
      return res.status(404).json({ message: "Reply comment not found" });
    }

    if (replyComment.userReply.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can't delete this reply comment" });
    }

    const deleteReplyComment = await ReplyComment.findByIdAndDelete(
      replyComment._id
    );

    if (deleteReplyComment) {
      await post.commentId.pull(deleteReplyComment._id);
      await post.save();
      return res.status(200).json({
        message: "Reply comment deleted successfully",
      });
    }
  } catch (error) {}
};
