// utils/notify.js
import Notification from "../models/notificationModel.js"
import UserModel from "../models/UserModel.js";

export const notifyAdmins = async  ({ type, message, url, data = {} }) =>{
  const admins = await UserModel.find({is_admin:true}).select("_id");

  // Créer une notification pour chaque admin
  const notifications = admins.map((admin) => ({
    type,
    message,
    url,
    data,
    user: admin._id,
  }));

  const created = await Notification.insertMany(notifications);
  return created;
}