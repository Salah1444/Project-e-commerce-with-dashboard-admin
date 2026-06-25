import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { authMiddleware } from "../middleware/auth.js";
const paymentRoute = express.Router();

paymentRoute.post('/create-checkout-session', authMiddleware, createCheckoutSession);

export default paymentRoute;
