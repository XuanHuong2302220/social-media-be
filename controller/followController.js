import Follow from "../models/followModel.js";
import Notification from "../models/notificationModel.js";
import User from "./../models/userModel.js";
import NotifyBox from "../models/notifyBoxModel.js";

export const createFollow = async (req, res) => {
  try {
    const userId = req.params.id;
    const authorId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (authorId.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const follower = await Follow.findOne({ authorId: authorId });

    const following = await Follow.findOne({ authorId: user._id });

    if (follower.followingId.includes(user._id)) {
      return res.status(400).json({ message: "Already following" });
    }

    if (!follower.followingId.includes(user._id)) {
      follower.followingId.push(user._id);
      await follower.save();
    }

    if (!following.followerId.includes(authorId)) {
      following.followerId.push(authorId);
      await following.save();
    }

    const noti = await Notification.create({
      senderId: authorId,
      receiverId: user._id,
      notiType: "follow",
      notiText: `${req.user.fullName} started following you`,
    });

    const notifyBox = await NotifyBox.findOne({ authorId: user._id });
    if (!notifyBox) {
      res.status(404).json({ message: "NotifyBox not found" });
    }
    if (!notifyBox.notifyId.includes(noti._id)) {
      await NotifyBox.findOneAndUpdate(
        { authorId: user._id },
        {
          $push: { notifyId: noti._id },
        }
      );
    }

    return res.status(200).json({ message: "Followed" });
  } catch (error) {
    console.log("Error in createFollow", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getFollowings = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = await Follow.findOne({ authorId: user._id });

    if (!following) {
      return res.status(404).json({ message: "No following found" });
    }

    const followingUsers = await User.find({
      _id: { $in: following.followingId },
    }).select("-password");

    return res.status(200).json({ followingUsers });
  } catch (error) {
    console.log("Error in getFollowings", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const follower = await Follow.findOne({ authorId: user._id });
    if (!follower) {
      return res.status(404).json({ message: "No follower found" });
    }

    const followerUsers = await User.find({
      _id: { $in: follower.followerId },
    }).select("-password");

    console.log(req.user._id);

    return res.status(200).json({ followerUsers });
  } catch (error) {
    console.log("Error in getFollowings", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    const authorId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = await Follow.findOne({ authorId: authorId });
    if (!following) {
      return res.status(404).json({ message: "No following found" });
    }

    if (!following.followingId.includes(user._id)) {
      return res.status(400).json({ message: "Not following" });
    }

    await following.followingId.pull(user._id);
    await following.save();

    const follower = await Follow.findOne({ authorId: user._id });
    await follower.followerId.pull(authorId);
    await follower.save();

    return res.status(200).json({ message: "Unfollowed" });
  } catch (error) {
    console.log("Error in deleteFollow", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFollower = async (req, res) => {
  try {
    const userId = req.params.id;
    const authorId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const follower = await Follow.findOne({ authorId: authorId });
    if (!follower) {
      return res.status(404).json({ message: "No following found" });
    }

    if (!follower.followerId.includes(user._id)) {
      return res.status(400).json({ message: "Not following" });
    }

    await follower.followerId.pull(user._id);
    await follower.save();

    const following = await Follow.findOne({ authorId: user._id });
    await following.followingId.pull(authorId);

    await following.save();

    return res.status(200).json({ message: "Unfollowed" });

    return res.status(200).json({ message: "Unfollowed" });
  } catch (error) {
    console.log("Error in deleteFollow", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
