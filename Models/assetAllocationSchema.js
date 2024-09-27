import mongoose, { Schema,Types } from "mongoose";

const Assets_Allocation= new Schema({
   
    employee_Id:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    asset_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'assets'
    },
    approved_By:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    issue_Date:{
        type:Date,
        required: true
    }

},{
    timestamps:true
})

 export default mongoose.model('Assets_Allocation',Assets_Allocation);
