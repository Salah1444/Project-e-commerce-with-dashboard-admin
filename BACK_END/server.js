import 'dotenv/config';
import express from "express";
import routeCat from "./routes/categoryRoute.js";
import mongoose from "mongoose";
import cors from "cors"
import routeVille from "./routes/villeRoute.js";
import productsRoute from "./routes/productsRoute.js";
import cartRoute from "./routes/cartRoute.js";
import favoriteRoute from "./routes/favoriteRoute.js";
import routeUser from "./routes/userRoute.js";
import orderRoute from './routes/orderRoute.js';
import MessageRoute from "./routes/messageRoute.js";
import paymentRoute from './routes/paymentRoute.js';
import adminRoute from './routes/adminRoute.js';
import helmet from "helmet";
import routerNotification from "./routes/notificationRoute.js";
import http from"http";
import { initSocket } from "./socket.js";
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT_BACKEND || 5000;
initSocket(server);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// Restrict CORS to the frontend origin only
app.use(cors({
  origin: process.env.FRONTEND_URL ,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))
// connect to DB
try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('database Connected');
} catch (error) {
    console.error('Database connection failed on startup:', error);
    process.exit(1);
}

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(express.json());
// categories
app.use("/api/category",routeCat);
// user
app.use('/api/users',routeUser);
// ville 
app.use('/api/ville',routeVille);
// products
app.use('/api/products',productsRoute);
// cart
app.use('/api/cart',cartRoute);
// favorites
app.use('/api/favorites',favoriteRoute);
// payment
app.use('/api/payment', paymentRoute);
// orders
app.use('/api/orders', orderRoute);
// messages contact
app.use('/api/message',MessageRoute);
// admin
app.use('/api/admin', adminRoute);
// notifications
app.use("/api/notifications", routerNotification);
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  
  if (err.name === 'MulterError' || err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: `Upload error: ${err.message || 'File too large (max 5MB)'}` });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// run serve
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
