
import express from "express";
import { adminMiddleware } from "../middleware/auth.js";
const routerNotification = express.Router();
import Notification from "../models/notificationModel.js";

// GET /api/notifications — liste paginée
routerNotification.get("/", adminMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Notification.countDocuments({ user: req.user._id });

  res.json({ data: notifications, total, page, pages: Math.ceil(total / limit) });
});

// GET /api/notifications/unread-count
routerNotification.get("/unread-count", adminMiddleware, async (req, res) => {
  const count = await Notification.countDocuments({ user: req.user._id, read: false });
  res.json({ count });
});

// PATCH /api/notifications/:id/read
routerNotification.patch("/:id/read", adminMiddleware, async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true }
  );
  res.json({ message: "Notification lue" });
});

// PATCH /api/notifications/read-all
routerNotification.patch("/read-all", adminMiddleware, async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );
  res.json({ message: "Toutes les notifications lues" });
});

export default routerNotification;