import { Router } from "express";
import { currentUser, demo, getAllUsers, Login, Register } from "../Controllers/authControllers.js";


const router = Router()

router.get('/demo' , demo)
router.post('/register',Register)
router.post('/login',Login)
router.get('/current-user',currentUser)
router.get('/all-users',getAllUsers)

export default router