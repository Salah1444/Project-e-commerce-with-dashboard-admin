import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;

  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Notification.countDocuments({ user: req.user._id });

  res.json({
    data: notifications,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};

export const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    read: false,
  });
  res.json({ count });
};

export const markAsRead = async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true }
  );
  res.json({ message: "Notification marked as read" });
};

export const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );
  res.json({ message: "All notifications marked as read" });
};
