import userModel from "../models/userModel.js";

export const ToggleFavorite = async (req, res) => {
    const { productId } = req.body;       
    const userId = req.user.user;

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        const favoriteIndex = user.Favorite.findIndex(item => item == productId);

        if (favoriteIndex !== -1) {
            // Already a favorite, remove it
            user.Favorite.splice(favoriteIndex, 1);
        } else {
            // Not a favorite, add it
            user.Favorite.push(productId);
        }

        await user.save();
        await user.populate("Favorite");
        res.json({ success: true, favorites: user.Favorite });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "something went wrong" });
    }
}

export const getFavorites = async (req, res) => {
    const userId = req.user.user;
    try {
        const user = await userModel.findById(userId).populate("Favorite");
        if (!user) return res.json({ success: false, message: "User not found" });
        res.json({ success: true, favorites: user.Favorite });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "something went wrong" });
    }
}
