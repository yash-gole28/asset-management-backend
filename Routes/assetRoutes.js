import { Router } from "express";
import { AddCategories, AssetRegistration } from "../Controllers/assetControllers.js";



const router = Router()

router.post('/add-category',AddCategories)
router.post('/assetRegister',AssetRegistration)



export default router