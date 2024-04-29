import mongoose from "mongoose";

const notifyBox = mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notifyId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
});

const NotifyBox = mongoose.model("NotifyBox", notifyBox);
export default NotifyBox;
