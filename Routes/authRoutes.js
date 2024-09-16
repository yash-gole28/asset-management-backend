import { Router } from "express";
import { demo, Register } from "../Controllers/authControllers.js";


const router = Router()

router.get('/demo' , demo)
router.post('/register',Register)

export default router