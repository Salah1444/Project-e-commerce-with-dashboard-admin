import express from "express";
import { createUser, deleteUser, getMe, loginUser, updateUser,updatePassword } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { addReview, getReviews } from "../controllers/reviewsController.js";
import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 7,                    
  message: { success: false, message: "Too many login attempts, try again later" }
});
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 10,                    
  message: { success: false, message: "Too many registrations, try again later" }
});
const routeUser = express.Router();
routeUser.post('/register', registerLimiter, createUser);
routeUser.post('/login',loginLimiter,loginUser);
routeUser.get('/me', authMiddleware, getMe);
routeUser.post('/reviews/add-review/:product',authMiddleware,addReview);
routeUser.get('/reviews/:id',getReviews);
routeUser.put('/update/:_id',authMiddleware,updateUser);
routeUser.put('/updatePassword/:_id',authMiddleware,updatePassword);
routeUser.delete('/delete/:_id',authMiddleware,deleteUser);
export default routeUser;
