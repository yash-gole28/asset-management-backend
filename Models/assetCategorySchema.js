import mongoose, { Mongoose, Schema } from "mongoose";

const Assets_Category=new Schema({
    category:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

export default mongoose.model("categories",Assets_Category);