import express from "express"
import {getOrCreateUser} from "../controllers/userController.js"
const router = express.Router()

router.get("/me", getOrCreateUser)

export default router
