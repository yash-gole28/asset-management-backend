import { Router } from "express";
import { changeActiveUser, currentUser, demo, getAllActiveUsers, getAllUsers, Login, Register } from "../Controllers/authControllers.js";


const router = Router()

router.get('/demo' , demo)
router.post('/register',Register)
router.post('/login',Login)
router.get('/current-user',currentUser)
router.get('/all-users',getAllUsers)
router.get('/all-active-users',getAllActiveUsers)
router.put('/change-active-user',changeActiveUser)


export default router