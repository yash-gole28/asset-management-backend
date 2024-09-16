import { Router } from "express";
import { demo } from "../Controllers/authControllers.js";


const router = Router()

router.get('/demo' , demo)

export default router