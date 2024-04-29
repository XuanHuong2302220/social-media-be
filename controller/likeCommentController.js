import Comment from "../models/post/commentModel.js";
import LikeComment from "../models/post/likeCommentModel.js";
import Post from "../models/post/postModel.js";
import Notification from "../models/notificationModel.js";
import NotifyBox from "../models/notifyBoxModel.js";

export const createLike = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { typeLike } = req.body;
    const userId = req.user._id;

    if (!typeLike) res.status(400).json({ message: "Type don't be empty" });

    const post = await Post.findById(postId);
    if (!post) res.status(404).json({ message: "Post not found" });

    const comment = await Comment.findById(commentId);

    if (!comment) res.status(404).json({ message: "Comment not found" });

    if (!post.commentId.includes(comment._id))
      res.status(404).json({ message: "Comment not found in post" });

    const like = await LikeComment.create({
      userLike: userId,
      commentLike: comment._id,
      typeLike,
    });

    if (like) {
      await comment.likeComment.push(like._id);
      await comment.save();

      if (userId.toString() === comment.senderId.toString()) {
        return res
          .status(400)
          .json({ message: "You can like, but don't notify" });
      }

      const noti = await Notification.create({
        senderId: userId,
        receiverId: comment.receiverId,
        notiType: "like",
        notiText: `${req.user.fullName} expressed feelings about your comment`,
        typeLike: typeLike,
      });

      const notifyBox = await NotifyBox.findOne({
        authorId: comment.receiverId,
      });
      if (!notifyBox.notifyId.includes(noti._id)) {
        await NotifyBox.findOneAndUpdate(
          { authorId: comment.receiverId },
          { $push: { notifyId: noti._id } }
        );
      }
      return res
        .status(201)
        .json({ message: "Like created successfully", like: like });
    }
  } catch (error) {
    console.log("Error in createCommentLike", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLikes = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) res.status(404).json({ message: "Post not found" });

    const comment = await Comment.findById({ _id: commentId });
    if (!comment) res.status(404).json({ message: "Comment not found" });

    if (!post.commentId.includes(comment._id))
      res.status(404).json({ message: "Comment not found in post" });

    const likes = await LikeComment.find({ commentLike: comment._id });

    if (likes) {
      return res.status(200).json({ message: "Likes found", likes: likes });
    }
  } catch (error) {
    console.log("Error in getLikes", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateLike = async (req, res) => {
  try {
    const { postId, commentId, id } = req.params;
    const { typeLike } = req.body;
    if (!typeLike) res.status(400).json({ message: "Type don't be empty" });
    const post = await Post.findById(postId);
    if (!post) res.status(404).json({ message: "Post not found" });

    const comment = await Comment.findById(commentId);
    if (!comment) res.status(404).json({ message: "Comment not found" });

    if (!post.commentId.includes(comment._id))
      res.status(404).json({ message: "Comment not found in post" });

    const like = await LikeComment.findById(id);
    if (!like) res.status(404).json({ message: "Like not found" });

    if (!comment.likeComment.includes(like._id))
      res.status(404).json({ message: "Like not found in comment" });

    const updatedLike = await LikeComment.findByIdAndUpdate(
      like._id,
      { typeLike: typeLike },
      { new: true }
    );

    if (updatedLike) {
      return res
        .status(200)
        .json({ message: "Like updated", like: updatedLike });
    }
  } catch (error) {
    console.log("Error in updateLike", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { postId, commentId, id } = req.params;
    const post = await Post.findById(postId);

    if (!post) res.status(404).json({ message: "Post not found" });
    const comment = await Comment.findById(commentId);
    if (!comment) res.status(404).json({ message: "Comment not found" });

    if (!post.commentId.includes(comment._id))
      res.status(404).json({ message: "Comment not found in post" });

    const like = await LikeComment.findById(id);
    if (!like) res.status(404).json({ message: "Like not found" });

    if (!comment.likeComment.includes(like._id))
      res.status(404).json({ message: "Like not found in comment" });

    const deletedLike = await LikeComment.findByIdAndDelete(like._id);

    if (deletedLike) {
      await comment.likeComment.pull(deletedLike._id);
      await comment.save();
      return res
        .status(200)
        .json({ message: "Like deleted", like: deletedLike });
    }
  } catch (error) {
    console.log("Error in deleteLike", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
