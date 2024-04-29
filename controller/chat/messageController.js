import Message from "../../models/chat/MessageModel.js";
import Conversation from "./../../models/chat/ConversationModel.js";
import User from "../../models/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const { id } = req.params;

    if (!message)
      return res.status(400).json({ message: "Message don't be empty" });

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId: user._id,
      message,
    });

    const conversation = await Conversation.findOne({
      participants: { $in: [senderId, user._id] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await Conversation.findOneAndUpdate(
      { participants: { $in: [senderId, user._id] } },
      { $push: { messages: newMessage._id } }
    );

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const conversation = await Conversation.findOne({
      participants: { $in: [userId, user._id] },
    }).populate({
      path: "messages",
    });

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    return res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const user = req.user._id;

    const Receiver = await User.findById(userId);
    if (!Receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const conversation = await Conversation.findOne({
      participants: { $in: [user, Receiver._id] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.messages.includes(id))
      return res.status(404).json({ message: "Message not found" });

    const deleteMessage = await Message.findByIdAndDelete(id);
    if (deleteMessage) {
      await Conversation.findOneAndUpdate(
        { participants: { $in: [user, Receiver._id] } },
        { $pull: { messages: id } }
      );

      return res.status(200).json({ message: "Message deleted successfully" });
    }
  } catch (error) {
    console.log("Error in deleteMessage", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
