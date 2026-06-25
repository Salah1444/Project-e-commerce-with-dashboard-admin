import express from "express";
import { getDashboardStats, getAllUsers, createAdmin } from "../controllers/adminController.js";
import { updateReviewRating } from "../controllers/reviewsController.js";
import { adminMiddleware } from "../middleware/auth.js";

const adminRoute = express.Router();

adminRoute.get("/stats", adminMiddleware, getDashboardStats);

adminRoute.get("/users", adminMiddleware, getAllUsers);
adminRoute.put("/review-rating/:id", adminMiddleware, updateReviewRating);
adminRoute.post("/create-admin", adminMiddleware, createAdmin);


export default adminRoute;
