import express from 'express';
import { createOrder,getAllOrders,getOrderById,updateOrderStatus } from '../controllers/orderController.js';
import { authMiddleware,adminMiddleware } from "../middleware/auth.js";

import rateLimit from 'express-rate-limit';

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many order requests, try again later" }
});

const orderRoute = express.Router();

orderRoute.post('/create', authMiddleware, orderLimiter, createOrder);
orderRoute.get("/", adminMiddleware, getAllOrders);
orderRoute.put("/:id", adminMiddleware, updateOrderStatus);
orderRoute.get("/:id", adminMiddleware, getOrderById);

export default orderRoute;
