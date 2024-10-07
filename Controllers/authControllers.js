import authSchema from "../Models/authSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const demo = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: 'hello there' })
    } catch (error) {
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
        // console.log(req.body)
        if (!email || !password || !firstName || !lastName || !role || !department) {
            return res.status(400).json({ success: false, message: 'Incomplete details or extra spaces detected' });
        }
        console.log(createdBy)
        const id = createdBy
        const findUser = await authSchema.findById(id);
        if (!findUser) {

            return res.status(409).json({ success: false, message: 'invalid credentials' });
        }
        // console.log(findUser.role)
        if (!findUser || !['admin', 'it'].includes(findUser.role)) {
            return res.status(400).json({ success: false, message: 'Invalid role or user not found' });
        }
        const findExistence = await authSchema.findOne({ email })

        if (findExistence) {
            return res.status(409).json({ success: false, message: 'Email already exists' })
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
        // console.log(req.body)

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Incomplete data' });
        }

        const getUser = await authSchema.findOne({ email }).select("name email password active");
        // console.log(getUser)
        if (!getUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log(getUser)
        if(getUser.active === false){
            return res.status(404).json({success:false, message:'user not active'})
        }

        const check = await bcrypt.compare(password, getUser.password);
        if (!check) {
            return res.status(400).json({ success: false, message: 'Wrong password' });
        }

        const token = jwt.sign(
            { username: getUser.username, id: getUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({ success: true, message: 'login Successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};


export const currentUser = async (req, res) => {
    try {
        const token = req.headers.authorization
        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const parseToken = JSON.parse(token)
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(parseToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                    // return res.status(401).json({success:false , message:'token expired'})
                } else {
                    resolve(decoded);
                }
            });
        });
        const user = await authSchema.findById(decoded.id).select('_id firstName lastName role')
        if(!user){
            return res.status(401).json({ message: 'user not found' });
        }
        return res.status(200).json({ success: true, message: 'User found', user})

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }

}

export const getAllUsers = async (req , res) => {
    try{
        const users = await authSchema.find({}).select('_id firstName lastName email department active role')
        if(!users){
            return res.status(404).json({ message: 'No users found' })
        }
        return res.status(200).json({ success: true, message: 'Users found', users})
    }catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}

export const getAllActiveUsers = async (req , res) => {
    try{
        const users = await authSchema.find({active:true}).select('_id firstName lastName')
        // console.log(users)
        if(!users){
            return res.status(404).json({ message: 'No users found' })
        }
        return res.status(200).json({ success: true, message: 'Users found', users})
    }catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}

export const changeActiveUser = async (req, res) => {
    try{
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'id is required' });
        }

        const user = await authSchema.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.active = !user.active;

        await user.save();

        return res.status(200).json({ success: true, message:'user updated' });
    }catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}

export const getProfileDetails = async(req, res) => {
    try{
        const token = req.headers.authorization
        // console.log(token) 
        const parseToken = JSON.parse(token)
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(parseToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                    // return res.status(401).json({success:false , message:'token expired'})
                } else {
                    resolve(decoded);
                }
            });
        });
        const user = await authSchema.findById(decoded.id).select('-password')
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found'})
        }
        
        return res.status(200).json({ success: true, message: 'User profile found',user})
    }catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}