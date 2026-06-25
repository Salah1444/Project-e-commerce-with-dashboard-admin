import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productsModel from "../models/productsModel.js";
import bcrypt from "bcrypt";

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({ is_admin: false });
        const totalProducts = await productsModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();

        // Calculate Revenue from Completed orders
        const orders = await orderModel.find({ paymentStatus: "Completed" });
        const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const last24hOrders = await orderModel.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } });
        const newUsers = await userModel.countDocuments({ createdAt: { $gte: twentyFourHoursAgo }, is_admin: false });
        const users = await userModel.find({ is_admin: false }).populate("VilleId", "ville").select("createdAt VilleId");

        // MoM calculations
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // This Month vs Last Month Revenue
        const thisMonthOrders = await orderModel.find({
            createdAt: { $gte: startOfThisMonth },
            paymentStatus: "Completed"
        });
        const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        const lastMonthOrders = await orderModel.find({
            createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
            paymentStatus: "Completed"
        });
        const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        let revenueTrend = 0;
        if (lastMonthRevenue > 0) {
            revenueTrend = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (thisMonthRevenue > 0) {
            revenueTrend = 100;
        }

        // This Month vs Last Month Orders
        const thisMonthOrdersCount = await orderModel.countDocuments({ createdAt: { $gte: startOfThisMonth } });
        const lastMonthOrdersCount = await orderModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } });
        let ordersTrend = 0;
        if (lastMonthOrdersCount > 0) {
            ordersTrend = ((thisMonthOrdersCount - lastMonthOrdersCount) / lastMonthOrdersCount) * 100;
        } else if (thisMonthOrdersCount > 0) {
            ordersTrend = 100;
        }

        // This Month vs Last Month Customers (Users)
        const thisMonthUsersCount = await userModel.countDocuments({ createdAt: { $gte: startOfThisMonth }, is_admin: false });
        const lastMonthUsersCount = await userModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }, is_admin: false });
        let usersTrend = 0;
        if (lastMonthUsersCount > 0) {
            usersTrend = ((thisMonthUsersCount - lastMonthUsersCount) / lastMonthUsersCount) * 100;
        } else if (thisMonthUsersCount > 0) {
            usersTrend = 100;
        }

        // Low stock products alert
        const lowStockProducts = await productsModel.find({ stock: { $lt: 5 } }).select("name stock price image");

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                revenue,
                last24hOrders,
                newUsers,
                orders,
                users,
                trends: {
                    revenue: revenueTrend.toFixed(1),
                    orders: ordersTrend.toFixed(1),
                    users: usersTrend.toFixed(1)
                },
                lowStockProducts
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// Get All Users with optional pagination
export const getAllUsers = async (req, res) => {
    try {
        let totalUsers = await userModel.countDocuments();
        const users = (await userModel.find({}).select("-Password").sort({ createdAt: -1 }));
            res.json({
                success: true,
                users,
                totalUsers
            });
        
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Create Admin (Secure, Protected Endpoint)
export const createAdmin = async (req, res) => {
    const { FullName, Email, Password, VilleId } = req.body;
    if (!FullName || !Email || !Password || !VilleId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (Password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    
    try {
        const exists = await userModel.findOne({ Email });
        if (exists) {
            return res.status(400).json({ success: false, message: "This email is already registered" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(Password, salt);
        const admin = await userModel.create({
            FullName,
            Email,
            Password: hashPassword,
            VilleId,
            is_admin: true
        });
        res.status(201).json({ success: true, message: "Admin created successfully", admin: { FullName, Email } });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ success: false, message: "Failed to create admin" });
    }
};

// Update Order Status

