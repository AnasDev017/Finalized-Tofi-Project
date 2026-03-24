import express from "express";
import { getSoldNumbers, sendOtp } from "../controllers/adminController.js";

const router = express.Router();

// Admin: get all sold numbers (with buyer info)
router.get("/numbers/sold", getSoldNumbers);

// Admin: send OTP to a specific number
router.post("/numbers/send-otp", sendOtp);

export default router;
