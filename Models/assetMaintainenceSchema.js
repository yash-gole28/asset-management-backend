import  mongoose, { Schema }  from "mongoose";

const Assets_Maintenance= new Schema({
    equipment:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'assets'
    },
    nature_of_problem:{
    type:String,
    required:true,
    },
    repair_made:{
        type:String,
    },
    replaced_or_repair:{
        type:String,

    },
    startDate:{
        type:Date,
        required:true, 
    },
    endDate:{
        type:Date,
        required:true,
    },
    replaced_Reason:{
        type:String,
        required:true

    },
    reason_of_issue:{
        type:String,
        required:true
    },
    action_taken:{
        type:String,

    },
    reportedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    remarks:{
        type:String,
        
    }
    
},{
   timestamps:true 
})
export default mongoose.model('maintenance',Assets_Maintenance);