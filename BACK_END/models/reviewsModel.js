import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  },
  rating: Number,
  comment: String
},
{ timestamps: true }
);
const  reviewsModel = mongoose.models.reviews || mongoose.model('reviews',reviewSchema)
export default reviewsModel;