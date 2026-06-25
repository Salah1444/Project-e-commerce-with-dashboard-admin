import Stripe from 'stripe';
import productsModel from "../models/productsModel.js";


if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { cartItems } = req.body;
        
        const productIds = cartItems.map(item => item.product?._id || item.product);
        const dbProducts = await productsModel.find({ _id: { $in: productIds } });
        
        const productMap = {};
        dbProducts.forEach(prod => {
            productMap[prod._id.toString()] = prod;
        });

        const lineItems = [];
        for (const item of cartItems) {
            const prodId = (item.product?._id || item.product || "").toString();
            const dbProduct = productMap[prodId];
            if (!dbProduct) {
                return res.status(400).json({ success: false, message: `Product not found: ${prodId}` });
            }
            lineItems.push({
                price_data: {
                    currency: "mad", 
                    product_data: {
                        name: dbProduct.name || "Product",
                        images: dbProduct.image ? [`${process.env.FRONTEND_URL || 'http://localhost:3000'}/uploads/products/${dbProduct.image}`] : [],
                    },
                    unit_amount: Math.round(dbProduct.price * 100), 
                },
                quantity: item.quantity,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL || "http://localhost:5174"}/success`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5174"}/cancel`,
        });

        res.json({ success: true, sessionId: session.id, sessionUrl: session.url });
    } catch (error) {
        console.error("Stripe error:", error);
        res.json({ success: false, message: "Could not create checkout session." });
    }
};
