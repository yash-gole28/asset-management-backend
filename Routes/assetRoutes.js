import { Router } from "express";
import { AddCategories, AssetRegistration, assetRequestChange, changeActiveCategory,
     FindCategory,getAllActiveCategory,getAllRequests,
     getAssets, getAssetsByCategory, getCategories, getKpiData, getLimitedRequests, getUserAssets, requestAsset } from "../Controllers/assetControllers.js";



const router = Router()

router.post('/add-category',AddCategories)
router.post('/register-asset',AssetRegistration)
router.get('/get-categories',getCategories)
router.get('/get-assets',getAssets)
router.get('/get-assets-by-category/:id',getAssetsByCategory)
router.post('/add-request',requestAsset)
router.get('/get-asset-requests',getAllRequests)
router.get('/get-top-asset-requests',getLimitedRequests)
router.post('/update-request',assetRequestChange)
router.get('/get-allcategory',FindCategory )
router.get('/all-active-category',getAllActiveCategory)
router.put('/change-active-category',changeActiveCategory)
router.get('/get-user-assets',getUserAssets)
router.get('/get-kpi-data',getKpiData)


export default router