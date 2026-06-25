import express from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/productsController.js";
import { adminMiddleware } from "../middleware/auth.js";
import { uploadProductImage } from "../middleware/upload.js";


const productsRoute = express.Router();
productsRoute.get("/getProducts", getProducts);
productsRoute.get("/getProduct/:id", getProductById);
productsRoute.post("/addProduct", adminMiddleware, uploadProductImage.single('image'), addProduct);
productsRoute.put("/updateProduct/:id", adminMiddleware, uploadProductImage.single('image'), updateProduct);
productsRoute.delete("/deleteProduct/:id", adminMiddleware, deleteProduct);
export default productsRoute;