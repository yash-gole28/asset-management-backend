import { Router } from "express";
import { demo, Login, Register } from "../Controllers/authControllers.js";


const router = Router()

router.get('/demo' , demo)
router.post('/register',Register)
router.post('/login',Login)

export default router