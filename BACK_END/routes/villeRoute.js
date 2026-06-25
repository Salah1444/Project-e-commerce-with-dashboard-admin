
import express from "express";
import { createVille , deleteVille, getVille } from "../controllers/villeController.js";
import { adminMiddleware } from "../middleware/auth.js";
const routeVille = express.Router();
routeVille.post('/create', adminMiddleware, createVille);
routeVille.get('/',getVille);
routeVille.delete('/delete/:id', adminMiddleware, deleteVille);
export default routeVille;
