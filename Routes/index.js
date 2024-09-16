import authRoute from "./authRoutes.js";
import { Router } from "express";

const router = Router()

router.use('/auth' , authRoute )

export default router