import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    FullName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },

    VilleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Villes"
    },
    Favorite: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    ],
    Cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    is_admin: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

const userModel = mongoose.models.Users || mongoose.model("Users", userSchema);
export default userModel;