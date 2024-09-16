import authSchema from "../Models/authSchema.js";
import bcrypt from 'bcrypt'



export const demo = async (req , res ) => {
    try{
        return res.status(200).json({success : true , message :'hello there'})
    }catch(error){
        console.log(error)
    }
} 


export const Register = async (req, res) => {
    try {

        const {
            firstName = '',
            middleName = '',
            lastName = '',
            email = '',
            password = '',
            role = '',
            department = '',
            createdBy = '',
            updatedBy = '',

           
        } = req.body;
        if (!email || !password || !firstName || !lastName || !role || !department) {
            return res.status(400).json({ success: false, message: 'Incomplete details or extra spaces detected' });
        }
        console.log(createdBy)
        const id = createdBy
        const findUser = await authSchema.findById(id);
        if (!findUser) {

            return res.status(409).json({ success: false, message: 'invalid credentials' });
        }
        console.log(findUser.role)
         if (!findUser || !['admin', 'it'].includes(findUser.role)) {
            return res.status(400).json({ success: false, message: 'Invalid role or user not found' });
        }
        const findExistence = await authSchema.findOne({email})

        if(findExistence){
            return res.status(409).json({ success: false, message: 'Email already exists'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new authSchema({
            email,
            password: hashedPassword,
            firstName,
            middleName,
            lastName,
            role,
            department,
            createdBy,
            updatedBy
          
        });

        await user.save();

        return res.status(201).json({ success: true, message: 'Registered successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.message });
        }
        console.error('Registration error:', error); // Log error server-side
        return res.status(500).json({ success: false, message: 'registration error' });
    }
};
