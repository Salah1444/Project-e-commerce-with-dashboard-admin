import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    shippingDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true }
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true }, // "Stripe" or "Deliv"
    paymentStatus: { type: String, default: "Pending" }, // "Pending", "Paid", "Failed"
    orderStatus: { type: String, default: "Processing" } // "Processing", "Shipped", "Delivered"
}, { timestamps: true });

const orderModel = mongoose.models.Orders || mongoose.model("Orders", orderSchema);
export default orderModel;
