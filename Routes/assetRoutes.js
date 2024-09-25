import { Router } from "express";
import { AssetsRegistration, Categories } from "../Controllers/assetControllers.js";



const router = Router()

router.post('/category',Categories)
router.post('/assetRegister',AssetsRegistration)



export default router