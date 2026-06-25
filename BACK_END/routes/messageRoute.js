import express from 'express';
import { sendMessage, getMessages, deleteMessage } from '../controllers/contactMessageController.js';
import rateLimit from 'express-rate-limit';
import { adminMiddleware,authMiddleware } from "../middleware/auth.js";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { success: false, message: "Too many messages, try again later" }
});

const MessageRoute = express.Router();

MessageRoute.post('/send', authMiddleware, contactLimiter, sendMessage);
MessageRoute.get('/all', adminMiddleware, getMessages);
MessageRoute.delete('/:id', adminMiddleware, deleteMessage);

export default MessageRoute;