import { mongoose, Schema } from "mongoose";

const Assets_Register=new Schema({

    name:{
        type:String,
        required:true
    },
    type:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'categories',
    },
    company:{
        type:String,
        required:true,
    },
    model_number:{
        type:String,
        required:true,

    },
    service_tag:{
        type:String,
    },
    description:{
        type:String,
    },
    allocation:{
        type:Boolean,
        default:false
    },
    registered_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

},{
    timestamps:true
})

export default mongoose.model('assets',Assets_Register);
