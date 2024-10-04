import { all } from "axios";
import assetCategorySchema from "../Models/assetCategorySchema.js";
import assetRegistrationSchema from "../Models/assetRegistrationSchema.js";
import allocationsSchema from "../Models/allocationsSchema.js";
import jwt from 'jsonwebtoken'


export const AddCategories = async (req, res) => {
    try {
       

      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Category name is required', success: false });
      }
    
      const existingCategory = await assetCategorySchema.findOne({ category: name });
  
      if (existingCategory) {
        return res.status(409).json({
          message: 'Category already exists',
          success: false,
          category: existingCategory,
        });
      }

      const token = req.headers.authorization
      console.log(token);
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      const parseToken = JSON.parse(token)
        let decoded = await new Promise((resolve, reject) => {
            jwt.verify(parseToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                    // return res.status(401).json({success:false , message:'token expired'})
                } else {
                    resolve(decoded);
                }
            });
        });
        console.log(decoded);
    
  
     
      const addCategory = new assetCategorySchema({
        category: name,
        createdBy: decoded.id
      });
  
      await addCategory.save();
    if (!addCategory) {
        res.status(404).json({ message: 'Failed to save Category', success: false });
    }
    //   const categories = await assetCategorySchema.find({}).select('category');
  
      res.status(201).json({
        success: true,
        message: 'Category created',
     
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'INTERNAL SERVER ERROR', success: false, error: error });
    }
  };
  

    export const getCategories = async (req , res) => {
        try{
            const categories = await assetCategorySchema.find({}).select('_id category')
            if(!categories){
                return res.status(404).json({message: 'No categories found', success: false})
            }
            res.status(200).json({ success: true, message:'categories found' , categories})
        }catch (error) {
            console.log(error);
            res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
            
        }
    }

 export const AssetRegistration=async (req,res)=>{
    try {
        const {
            name="",
            type="",
            modelNumber="",
            companyName="",
            serviceTag="",
            description="",
            registeredBy=""

        }=req.body.data
        console.log(req.body)

        if(!name||!modelNumber||!companyName||!type||!registeredBy){
            return res.status(400).json({ success: false, message: 'Incomplete details or extra spaces detected' });
        }
            
        const assets=new assetRegistrationSchema({
            name,
            type,
            model_number:modelNumber,
            company:companyName,
            description,
            service_tag : serviceTag,
            registered_by:registeredBy
        })
        
         await assets.save();
         return res.status(201).json({ success: true, message: 'Asset Registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
        
    }
 }


 export const getAssets = async (req , res) => {
    try{
        const assets = await assetRegistrationSchema.find({}).populate({
            path: 'registered_by',
            select: 'firstName _id'
        })
        if(!assets){
            return res.status(404).json({ success: false, message: 'No assets found'})
        }
        assets.reverse()
        return res.status(200).json({ success: true, message: 'Assets found', assets})
    }catch (error) {
        console.log(error);
        res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
        
    }
 }

 export const getAssetsByCategory = async (req , res) => {
    try{
        const {id} = req.params
        console.log(id)
        const assets = await assetRegistrationSchema.find({ type: id, allocation: false }).select('name _id')
        if(!assets){
            return res.status(404).json({ success: false, message: 'No assets found'})
        }
        return res.status(200).json({ success: true, message: 'Assets found', assets})
    }catch (error) {
        console.log(error);
        res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
        
    }
 }

 export const requestAsset = async (req , res) => {
    try{
       const {
            employee = "",
            asset=""
        } = req.body

        const addRequest = new allocationsSchema({
            employee_Id : employee,
            asset_id : asset,
        })
        const create = await addRequest.save()
        if(!create){
            return res.status(404).json({ success: false, message: 'Asset request failed'})
        }
        return res.status(200).json({ success: true, message: 'Asset request successful',})

    }catch (error) {
        console.log(error);
        res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
        
    }
 }

 export const getAllRequests = async (req , res) => {
    try{
        const requests = await allocationsSchema.find({}).populate({
            path:"employee_Id",
            select:"_id firstName lastName department"
        }).populate({
            path:"asset_id",
            select:"model_number service_tag name"
        })
        if(!requests){
            return res.status(404).json({ success: false, message: 'No requests found'})
        }
        requests.reverse()
        return res.status(200).json({ success: true, message: 'Requests found', requests})
    }catch (error) {
        console.log(error);
        res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
        
    }
}

export const assetRequestChange = async (req , res) => {
    try{
        const {requestId , action ,assetId} = req.body
        // console.log(req.body)
        const findAsset = await assetRegistrationSchema.findById(assetId)
        if(!findAsset){
            return res.status(404).json({ success: false, message: 'failed to find asset'})
        }
        console.log(findAsset)
        if(findAsset.allocation == true){
            const updateStatus = await allocationsSchema.findByIdAndUpdate(requestId ,{ status:'rejected'})
            if(!updateStatus){
                return res.status(404).json({ success: false, message: 'Failed to update status'})
            }
            return res.status(404).json({success:false , message:"asset already allocated"})
        }
        if(action === "rejected"){
            const updateStatus = await allocationsSchema.findByIdAndUpdate(requestId ,{status:action})
            if(!updateStatus){
                return res.status(404).json({ success: false, message: 'Asset request failed to update'})
            }
            return res.status(200).json({ success: true, message: 'Asset request updated successfully'})
        }
        if(action === "approved"){
            const updateStatus = await allocationsSchema.findByIdAndUpdate(requestId ,{ status:action})
            const getAssetandUpdate = await assetRegistrationSchema.findByIdAndUpdate(assetId , {allocation:true})
            if(!updateStatus || !getAssetandUpdate){
                return res.status(404).json({ success: false, message: 'Asset request failed to updte'})
            }
            return res.status(200).json({ success: true, message: 'Asset request updated successfully'})
        }

    }catch (error) {
        console.log(error);
        res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
        
    }
}




export const FindCategory = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        // Get total count of categories
        const totalCategories = await assetCategorySchema.countDocuments();

        // Fetch categories with pagination
        const categories = await assetCategorySchema.find().populate({
              path: 'createdBy',
            select: 'firstName lastName'
        }).skip(skip).limit(limit);

        // Check if any categories are found
        if (!categories.length) {
            return res.status(404).json({ success: false, message: 'No categories found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories,
            total: totalCategories,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit), // Calculate total pages
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving categories' });
    }
};

export const getAllActiveCategory = async (req , res) => {
    try{
        const category = await assetCategorySchema.find({active:true}).select('_id category')
        console.log(category)
        if(!category){
            return res.status(404).json({ message: 'No category found' })
        }
        return res.status(200).json({ success: true, message: 'category found', category,})
    }catch (error) {
        console.error('error', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}

export const changeActiveCategory = async (req, res) => {
    try{
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'id is required' });
        }

        const category = await assetCategorySchema.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'category not found' });
        }

        category.active = !category.active;

        await category.save();

        return res.status(200).json({ success: true, message:'category updated' });
    }catch (error) {
        console.error(' error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}

export const getUserAssets = async (req, res) => {
    try{
        const token = req.headers.authorization
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
        const assets = await allocationsSchema.find({employee_Id:decoded.id , status:'approved'}).select('asset_id updatedAt').populate({
            path: 'asset_id',
            select:'name type company model_number service_tag ',
            populate:{
                path:'type',
                select:'category'
            }
        })
        if(!assets){
            return res.status(404).json({ success: false, message: 'No assets found'})
        }
        return res.status(200).json({ success: true, message: 'assets found', assets})
    }catch (error) {
        console.error(' error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}