import { Router } from "express";
import { AddCategories, AssetRegistration, assetRequestChange, getAllRequests, getAssets, getAssetsByCategory, getCategories, requestAsset } from "../Controllers/assetControllers.js";



const router = Router()

router.post('/add-category',AddCategories)
router.post('/register-asset',AssetRegistration)
router.get('/get-categories',getCategories)
router.get('/get-assets',getAssets)
router.get('/get-assets-by-category/:id',getAssetsByCategory)
router.post('/add-request',requestAsset)
router.get('/get-asset-requests',getAllRequests)
router.post('/update-request',assetRequestChange)



export default router