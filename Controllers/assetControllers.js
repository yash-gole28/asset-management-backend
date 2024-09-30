import { all } from "axios";
import assetCategorySchema from "../Models/assetCategorySchema.js";
import assetRegistrationSchema from "../Models/assetRegistrationSchema.js";
import allocationsSchema from "../Models/allocationsSchema.js";


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
  
      // Create a new category if it does not exist
      const addCategory = new assetCategorySchema({
        category: name,
      });
  
      await addCategory.save();
  
      // Fetch the updated list of categories
      const categories = await assetCategorySchema.find({}).select('category');
  
      res.status(201).json({
        success: true,
        message: 'Category created',
        categories,
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


export const FindCtegory=async(req,res)=>{
    try {
        const category=await assetCategorySchema.find()
        console.log(category)
        if(!category){
            return res.status(404).json({ success: false, message: 'No category found'})
        }
        return res.status(200).json({ success: true, message: 'all assets are find',category})
       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'category Not Found'})
    }
}