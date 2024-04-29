import Message from "../../models/chat/MessageModel.js";
import User from "../../models/userModel.js";
import Conversation from "./../../models/chat/ConversationModel.js";
export const createConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user._id;

    const receiver = await User.findById(userId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [user, userId] },
    });

    if (!conversation) {
      const newConversation = new Conversation({
        participants: [user, userId],
        messages: [],
      });

      await newConversation.save();
      return res.status(201).json({ conversation: newConversation });
    } else return res.status(200).json("Conversation already exists");
  } catch (error) {
    console.log("Error in createConversation", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const user = req.user._id;
    const conversations = await Conversation.find({
      participants: { $in: [user] },
    }).populate({
      path: "participants",
      select: ["username", "profilePicture"],
    });

    res.status(200).json({ conversations });
  } catch (error) {
    console.log("Error in getConversations", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $in: [user, id] },
    }).populate({
      path: "participants",
      select: ["username", "profilePicture"],
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json({ conversation });
  } catch (error) {
    console.log("Error in getConversation", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $in: [user, id] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const deleteConversation = await Conversation.findByIdAndDelete(
      conversation._id
    );

    if (deleteConversation) {
      await Message.deleteMany({ _id: { $in: conversation.messages } });
    }

    res.status(200).json({ message: "Conversation deleted" });
  } catch (error) {
    console.log("Error in deleteConversation", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
