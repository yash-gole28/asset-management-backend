import mongoose, { Schema } from "mongoose";

// Define the User schema
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'First name must be at least 3 characters long'],
        maxlength: [30, 'First name cannot exceed 30 characters']
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: { 
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Last name must be at least 1 character long'],
        maxlength: [30, 'Last name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function(v) {
                return /[0-9]/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v);
            },
            message: 'Password must contain at least one digit and one special character'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'it', 'employee'],
            message: 'Invalid role'
        }
    },
    department: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
       
    }
}, {
    timestamps: true
});

// Middleware to handle empty strings and default values


// Create and export the model
export default mongoose.model('User', UserSchema);
