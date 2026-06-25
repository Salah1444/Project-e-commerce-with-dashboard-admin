import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
{
  name: String,
  price: Number,
  stock: Number,

  category: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "Categorys",
    required:true,
},
  description : String,
  brand: String,
  warranty: String,
  sku: String,
  image: String,
  rating: Number,
},
{ 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);



const productsModel = mongoose.model("products", productSchema);
export default productsModel;

