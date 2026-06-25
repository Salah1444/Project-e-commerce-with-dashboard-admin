import mongoose from "mongoose";
const  MessageShema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    company:{
        type:String,
       
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})
export const  MessageModel = mongoose.models.Message || mongoose.model('Message', MessageShema);