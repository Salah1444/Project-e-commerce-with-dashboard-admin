import mongoose from "mongoose";
const villesShema = new mongoose.Schema({
    ville : {type:String,required:true},
    ZIP : {type:Number,required:true}
},
{timestamps:true});
const villeModel = mongoose.models.Villes || mongoose.model('Villes',villesShema);
export default villeModel;