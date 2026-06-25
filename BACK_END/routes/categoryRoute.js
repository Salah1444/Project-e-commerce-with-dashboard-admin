import {
  addCategory,
  deleteCategory,
  getAllCategories
} from "../controllers/categoryController.js";
import { adminMiddleware } from "../middleware/auth.js";
import express from "express";
import { uploadCategoryImage } from "../middleware/upload.js";
const routeCat = express.Router();
routeCat.post("/create", adminMiddleware, uploadCategoryImage.single("image"), addCategory);

routeCat.delete("/delete/:id", adminMiddleware, deleteCategory);

routeCat.get("/getCategory", getAllCategories);

export default routeCat;
  