import mongoose, { Mongoose, Schema } from "mongoose";

const Assets_Category=new Schema({
    category:{
        type:String,
        required:true,
    },
    active:{
        type:Boolean,
        default:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps:true
})

export default mongoose.model("categories",Assets_Category);