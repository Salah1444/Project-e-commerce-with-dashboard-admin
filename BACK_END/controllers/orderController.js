import orderModel from "../models/orderModel.js";
import productsModel from "../models/productsModel.js";
import { notifyAdmins } from "../utils/notify.js";
import { getIO } from "../socket.js";
import userModel from "../models/userModel.js";

export const createOrder = async (req, res) => {
  try {
    const { shippingDetails, cartItems, totalAmount, paymentMethod } = req.body;
    const userId = req.user.user;

    if (!shippingDetails || !cartItems || !totalAmount || !paymentMethod) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const productIds = cartItems.map(
      (item) => item.product?._id || item.product
    );
    const dbProducts = await productsModel.find({ _id: { $in: productIds } });

    const productMap = {};
    dbProducts.forEach((prod) => {
      productMap[prod._id.toString()] = prod;
    });

    let serverTotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const prodId = (item.product?._id || item.product || "").toString();
      const dbProduct = productMap[prodId];

      if (!dbProduct) {
        return res.json({
          success: false,
          message: `Product not found: ${prodId}`,
        });
      }

      if (dbProduct.stock < item.quantity) {
        return res.json({
          success: false,
          message: `Insufficient stock for product: ${dbProduct.name}`,
        });
      }

      serverTotal += dbProduct.price * item.quantity;
      orderItems.push({
        product: dbProduct._id,
        quantity: item.quantity,
        price: dbProduct.price,
      });
    }

    if (Math.abs(serverTotal - totalAmount) > 0.01) {
      return res.json({ success: false, message: "Invalid total amount" });
    }

    const newOrder = await orderModel.create({
      user: userId,
      shippingDetails,
      cartItems: orderItems,
      totalAmount: serverTotal,
      paymentMethod,
      paymentStatus: "Pending",
    });

    // Decrease stock for each ordered item
    for (const item of cartItems) {
      const prodId = (item.product?._id || item.product || "").toString();
      await productsModel.findByIdAndUpdate(prodId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart after order
    await userModel.updateOne({ _id: userId }, { Cart: [] });

    // Notify all admins about the new order
    const populatedOrder = await newOrder.populate("user");
    const notifications = await notifyAdmins({
      type: "new_order",
      message: `New order #${newOrder._id.toString().slice(-6)} from ${populatedOrder.user.FullName}`,
      url: `/admin/orders/${newOrder._id}`,
      data: { orderId: newOrder._id, amount: newOrder.totalAmount },
    });

    const io = getIO();
    notifications.forEach((notif) => {
      io.to(notif.user.toString()).emit("new_notification", notif);
    });

    res.json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "FullName Email").select("shippingDetails totalAmount orderStatus paymentStatus createdAt")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getOrderById = async (req,res)=>{
 const  {id}  =req.params;
 try {
  const order = await orderModel.findById(id).populate('user','FullName Email').populate('cartItems.product','name price image createdAt');
  if(!order){
    return res.status(404).json({success:false,message:"Order not found"});
  }
  res.json({success:true,order});
 } catch (error) {
  console.log(error)
  res.json({success:false,message :error.message});
 }
}
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    
    const { orderStatus, paymentStatus } = req.body;
    
    try {
        const order = await orderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        
        await order.save();
        const populatedOrder = await orderModel.findById(order._id).populate("user", "FullName Email").populate("cartItems.product");
        res.json({ success: true, message: "Order updated successfully", order: populatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};