import LikePost from "../models/post/likePostModel.js";
import Post from "../models/post/postModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import NotifyBox from "../models/notifyBoxModel.js";

export const createLike = async (req, res) => {
  try {
    const userLike = req.user._id;

    const user = await User.findById(userLike);

    const { postId: postLike } = req.params;

    const post = await Post.findById(postLike);

    if (!post) return res.status(400).json({ message: "Post not found" });

    if (!post.likePostId.includes(userLike)) {
      await post.likePostId.push(userLike);
      await post.save();
    }

    if (userLike.toString() !== post.authorId.toString()) {
      const noti = await Notification.create({
        senderId: userLike,
        receiverId: post.authorId,
        notiType: "like",
        notiText: `${user.fullName} liked about your post`,
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
    }

    res.status(200).json({ message: "Like created successfully" });
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

    const likes = await Promise.all(
      post.likePostId?.map(async (userId) => {
        return await User.findById(userId).select("-password");
      })
    );

    const sortLikes = [...likes];
    sortLikes.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(
      sortLikes?.map((like) => {
        return {
          _id: like._id,
          fullname: like.fullName,
          username: like.username,
          gender: like.gender,
          birthday: like.birthday,
          bio: like.bio,
          profilePicture: like.profilePicture,
        };
      })
    );
  } catch (error) {
    console.log("error in getLikesController", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const id = req.user._id;

    const post = await Post.findById(postId);

    if (!post) res.status(400).json({ message: "Post not found" });

    post.likePostId = post.likePostId.filter((userId) => {
      userId.toString() !== id.toString();
    });

    await post.save();

    return res.status(200).json({ message: "Like deleted successfully" });
  } catch (error) {
    console.log("error in deleteLikeController", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
