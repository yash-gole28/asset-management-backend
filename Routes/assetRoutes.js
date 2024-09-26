import { Router } from "express";
import { AddCategories, AssetRegistration, getAssets, getCategories } from "../Controllers/assetControllers.js";



const router = Router()

router.post('/add-category',AddCategories)
router.post('/register-asset',AssetRegistration)
router.get('/get-categories',getCategories)
router.get('/get-assets',getAssets)



export default router