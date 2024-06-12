import LikePost from "../models/post/likePostModel.js";
import Post from "../models/post/postModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import NotifyBox from "../models/notifyBoxModel.js";

export const createLike = async (req, res) => {
  try {
    const userLike = req.user._id;

    const { postId: postLike } = req.params;

    const like = await LikePost.findOne({ userLike, postLike });

    if (like)
      return res
        .status(400)
        .json({ message: "You have already liked this post" });

    const newLike = await LikePost.create({
      userLike,
      postLike,
    });

    if (newLike) {
      newLike.isLiked = true;
      await newLike.save();
    }

    const post = await Post.findById(postLike);

    if (!post) return res.status(400).json({ message: "Post not found" });

    if (post.likePostId.includes(newLike._id))
      return res
        .status(400)
        .json({ message: "You have already liked this post" });

    post.likePostId.push(newLike._id);
    await post.save();

    const user = await User.findById(userLike);

    if (userLike.toString() === post.authorId.toString()) {
      return res
        .status(400)
        .json({ message: "You can like, but don't notify" });
    }

    const noti = await Notification.create({
      senderId: userLike,
      receiverId: post.authorId,
      notiType: "like",
      notiText: `${user.fullName} expressed feelings about your post`,
      typeLike: typeLike,
    });

    const notifyBox = await NotifyBox.findOne({ authorId: post.authorId });
    if (!notifyBox.notifyId.includes(noti._id)) {
      await NotifyBox.findOneAndUpdate(
        { authorId: post.authorId },
        {
          $push: { notifyId: noti._id },
        }
      );
    }

    res
      .status(200)
      .json({ message: "Like created successfully", like: newLike });
  } catch (error) {
    console.log("error in createLikeController", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) res.status(400).json({ message: "Post not found" });

    const like = await LikePost.find();
    if (!like) res.status(400).json({ message: "No user have liked it yet" });

    res.status(200).json({
      likes: like.length,
      like: like,
    });
  } catch (error) {
    console.log("error in getLikesController", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const id = req.user._id;
    const post = await Post.findById(postId);
    if (!post) res.status(400).json({ message: "Post not found" });

    const like = await LikePost.findOne({ userLike: id, postLike: postId });
    if (!like)
      res.status(400).json({ message: "You have not liked this post" });

    res.status(200).json(like);
  } catch (error) {
    console.log("error in getLikeController", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { postId, id } = req.params;

    const post = await Post.findById(postId);

    if (!post) res.status(400).json({ message: "Post not found" });

    const like = await LikePost.findByIdAndDelete(id);

    if (!like) res.status(400).json({ message: "Like not found" });

    post.likePostId = post.likePostId.filter((likeId) => {
      likeId.toString() !== id.toString();
      console.log(likeId);
    });

    await post.save();

    return res.status(200).json({ message: "Like deleted successfully" });
  } catch (error) {
    console.log("error in deleteLikeController", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
