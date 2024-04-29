import Notification from "../models/notificationModel.js";
import NotifyBox from "../models/notifyBoxModel.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifies = await NotifyBox.find({ authorId: userId });

    console.log("notifies: ", notifies);

    const notifications = await Promise.all(
      notifies.map(async (notify) => {
        return await Notification.find({ _id: notify.notifyId });
      })
    );

    if (!notifications)
      return res.status(404).json({ message: "No notifications found" });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notifyBox = await NotifyBox.findOne({ authorId: userId });

    const notification = await Notification.findById(id);

    console.log("notification: ", notification);

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    const deleteConfication = await Notification.findByIdAndDelete(id);

    if (deleteConfication) {
      if (notifyBox.notifyId.includes(notification._id)) {
        await notifyBox.notifyId.pull(notification._id);
        await notifyBox.save();

        return res.status(200).json({ message: "Notification deleted" });
      }
    }
  } catch (error) {
    console.log("Error in deleteNotification: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
