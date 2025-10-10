import Notification from "../models/NotificationModel.js";

function getCurrentISTTime() {
  const now = new Date();

  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(now);

  const dateParts = {};
  parts.forEach(({ type, value }) => {
    dateParts[type] = value;
  });

  return `${dateParts.hour}:${dateParts.minute} ${dateParts.dayPeriod}`;
}


const newNotification = async (req, res) => {
    const currentTime = getCurrentISTTime();
  try {
    const { projectId, sender } = req.body;
    if (!sender || !projectId) {
      return res.status(400).json({ message: "All fields are required" });
      }
    const notification = new Notification({ projectId, sender, createdAt: currentTime });
    await notification.save();
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const notifications = await Notification.find({ sender: userId }).populate('projectId').populate('sender');
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { newNotification, getNotifications, deleteNotification };