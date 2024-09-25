import authSchema from "../Models/authSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



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

           
        } = req.body.data;
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


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body.data;
        console.log(req.body)

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Incomplete data' });
        }

        const getUser = await authSchema.findOne({ email }).select("name email password");
        // console.log(getUser)
        if (!getUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const check = await bcrypt.compare(password, getUser.password);
        if (!check) {
            return res.status(400).json({ success: false, message: 'Wrong password' });
        }

        const token = jwt.sign(
            { username: getUser.username, id: getUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ success: true, message: 'login Successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};