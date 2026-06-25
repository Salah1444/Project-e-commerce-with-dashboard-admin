
import userModel from "../models/userModel.js";

export const AddToCart = async (req, res) => {
    const { productId } = req.body;       
    const userId = req.user.user;

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });
        const cartItem = user.Cart.find(item => item.product == productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.Cart.push({ product: productId, quantity: 1 });
        }

        await user.save();
        await user.populate("Cart.product");
        res.json({ success: true, cart: user.Cart });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "something went wrong" });
    }
}
export const getCart = async (req, res) => {
    const userId = req.user.user;
    try {
        const user = await userModel.findById(userId).populate("Cart.product");
        if (!user) return res.json({ success: false, message: "User not found" });
        res.json({ success: true, cart: user.Cart });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "something went wrong" });
    }
}
export const decreaseQte = async (req, res) => {
    const { productId } = req.body;       
    const userId = req.user.user;
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        const cartItem = user.Cart.find(item => item.product == productId);

        if (cartItem) {
            cartItem.quantity -= 1;
            if (cartItem.quantity === 0) {
                user.Cart = user.Cart.filter(item => item.product != productId);
            }
        }
        await user.save();
        await user.populate("Cart.product");
        res.json({ success: true, cart: user.Cart });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "something went wrong" });
    }
}
