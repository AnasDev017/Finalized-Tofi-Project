import  express  from "express";
import { login, logout, sendUserData, signUp} from "../controllers/authController.js";
import { tokenVerifcation } from "../middleware/tokenVerification.js";
const authRoutes = express.Router()

authRoutes.post('/signUp',signUp)
authRoutes.post('/login',login)
authRoutes.post('/logout',logout)
authRoutes.get("/api/me", tokenVerifcation, sendUserData)
 
export default authRoutes