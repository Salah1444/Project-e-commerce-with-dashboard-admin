import mongoose from "mongoose";
const categoryShema = new mongoose.Schema({
    category : {type:String,required:true},
    Image : String,
});
const categoryModel = mongoose.models.Categorys || mongoose.model('Categorys',categoryShema);
export default categoryModel;