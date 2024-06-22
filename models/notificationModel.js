import mongoose from "mongoose";

const notifi = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    notiType: {
      type: String,
      enum: ["like", "comment", "replyComment", "follow"],
      required: true,
    },
    notiText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notifi);
export default Notification;
