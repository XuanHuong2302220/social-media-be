import mongoose from "mongoose";

const message = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requierd: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requierd: true,
  },
  message: {
    type: String,
    reqquired: true,
  },
});

const Message = mongoose.model("Message", message);
export default Message;
