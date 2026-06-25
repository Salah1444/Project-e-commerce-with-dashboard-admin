import express from "express"
import { ToggleFavorite, getFavorites } from "../controllers/favoriteController.js";
import { authMiddleware } from "../middleware/auth.js";

const favoriteRoute = express.Router();

favoriteRoute.get("/getFavorites", authMiddleware, getFavorites);
favoriteRoute.post("/ToggleFavorite", authMiddleware, ToggleFavorite);

export default favoriteRoute;
