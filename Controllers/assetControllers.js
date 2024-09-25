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
            message: 'Category CREATED',
            success: true
          })
        
    } catch (error) {
       console.log(error);
       res.status(500).json({ message: 'INTERNAL SERVER ERROR', success: false, error: error })
       
        
    }
}

 export const AssetRegistration=async (req,res)=>{
    try {
        const {
            name="",
            type="66f3ab757274835da2b13f8b",
            model_number="",
            company="",
            service_tag="",
            allocation='',
            registered_by="66e817a74d92c09dd3213f7f"

        }=req.body

        if(!name||!model_number||!company||!service_tag||!allocation){
            return res.status(400).json({ success: false, message: 'Incomplete details or extra spaces detected' });
        }
            
        const assets=new assetRegistrationSchema({
            name,
            type,
            model_number,
            company,
            service_tag,
            allocation,
            registered_by
        })
        
         await assets.save();
         return res.status(201).json({ success: true, message: 'Asset Registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'INTERNAL SERVER ERROR',success:false,error:error})
        
    }
 }