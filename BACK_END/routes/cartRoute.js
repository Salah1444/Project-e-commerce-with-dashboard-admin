import express from "express"
import { AddToCart, decreaseQte, getCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";
import rateLimit from 'express-rate-limit';

const cartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, message: "Too many cart actions, try again later" }
});

const cartRoute = express.Router();
cartRoute.get("/getCart",authMiddleware, getCart);
cartRoute.post("/AddToCart",authMiddleware, cartLimiter, AddToCart);
cartRoute.put("/DecreaseQte",authMiddleware, cartLimiter, decreaseQte);
export default cartRoute;
