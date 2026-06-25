import { MessageModel } from "../models/messageModel.js";
import { getIO } from "../socket.js";
import { notifyAdmins } from "../utils/notify.js";

export const sendMessage = async (req, res) => {
  const { firstName, lastName, company, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  if (!/^[\d\s\-\+\(\)]{6,20}$/.test(phone)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number" });
  }

  if (message.trim().length < 10) {
    return res
      .status(400)
      .json({ success: false, message: "Message must be at least 10 characters" });
  }

  if (message.trim().length > 2000) {
    return res
      .status(400)
      .json({ success: false, message: "Message is too long (max 2000 characters)" });
  }

  try {
    const contactMsg = await MessageModel.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company?.trim() || "Not provided",
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
    });

    // Notify all admins about the new contact message
    const notifications = await notifyAdmins({
      type: "contact_message",
      message: `New message from ${contactMsg.firstName}`,
      url: `/admin/messages/${contactMsg._id}`,
      data: { sender: contactMsg.email, messageId: contactMsg._id },
    });

    const io = getIO();
    notifications.forEach((notif) => {
      io.to(notif.user.toString()).emit("new_notification", notif);
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await MessageModel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
