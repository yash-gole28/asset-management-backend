import { all } from "axios";
import assetCategorySchema from "../Models/assetCategorySchema.js";
import assetRegistrationSchema from "../Models/assetRegistrationSchema.js";
import allocationsSchema from "../Models/allocationsSchema.js";


export const AddCategories = async (req, res) => {
    try {
      const { name } = req.body;
  
      // Validate input
      if (!name) {
        return res.status(400).json({ message: 'Category name is required', success: false });
      }
  
      // Check if the category already exists
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
            assetCategory= "",
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