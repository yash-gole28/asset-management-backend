import { all } from "axios";
import assetCategorySchema from "../Models/assetCategorySchema.js";
import assetRegistrationSchema from "../Models/assetRegistrationSchema.js";

export const AddCategories=async (req,res)=>{
    try {
        const  body=req.body;
        console.log(body);
        
        const category=new assetCategorySchema(body);;
        await category.save()
        res.status(201).json({
            message: 'Category created',
            success: true
          })
        
    } catch (error) {
       console.log(error);
       res.status(500).json({ message: 'INTERNAL SERVER ERROR', success: false, error: error })
       
        
    }
}

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