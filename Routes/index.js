import authRoute from "./authRoutes.js";
import assetRoute from "./assetRoutes.js"
import { Router } from "express";

const router = Router()

router.use('/auth' , authRoute )
router.use('/asset' , assetRoute)

export default router