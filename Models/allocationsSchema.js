import mongoose, { Schema } from "mongoose";

const Assets_Allocation = new Schema({
    employee_Id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    asset_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assets'
    },
    approved_By: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Enum for status
        default: 'pending' // Set default status
    }
}, {
    timestamps: true
});

export default mongoose.model('Allocations', Assets_Allocation);
